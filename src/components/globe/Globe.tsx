import { useEffect, useRef, useCallback } from 'react'
import * as Cesium from 'cesium'
import { useFlightStore } from '../../stores/flightStore'
import { useThemeStore } from '../../stores/themeStore'
import { usePanelStore } from '../../stores/panelStore'
import { Aircraft } from '../../types'

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || ''

// Icono avión — blanco para tema oscuro, negro para tema claro
function getPlaneSvg(dark: boolean) {
  const color = dark ? 'white' : '#1a202c'
  const stroke = dark ? 'rgba(0,212,255,0.6)' : 'rgba(0,80,200,0.5)'
  return `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path fill="${color}" stroke="${stroke}" stroke-width="1"
    d="M16 2 L20 14 L30 16 L20 18 L18 28 L16 26 L14 28 L12 18 L2 16 L12 14 Z"/>
</svg>
`)}`
}

function getSelectedPlaneSvg() {
  return `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path fill="#00ffcc" stroke="#00ffcc" stroke-width="1.5"
    d="M16 2 L20 14 L30 16 L20 18 L18 28 L16 26 L14 28 L12 18 L2 16 L12 14 Z"/>
</svg>
`)}`
}

function createImageryProvider(dark: boolean) {
  return new Cesium.UrlTemplateImageryProvider({
    url: dark
      ? 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    minimumLevel: 0,
    maximumLevel: 19,
    credit: dark
      ? '© CartoDB © OpenStreetMap contributors'
      : '© OpenStreetMap contributors',
  })
}

export default function Globe() {
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const billboardsRef = useRef<Cesium.BillboardCollection | null>(null)
  const icaoToBillboard = useRef<Map<string, Cesium.Billboard>>(new Map())
  const trackPolylineRef = useRef<Cesium.Primitive | null>(null)

  const filteredAircraft = useFlightStore(s => s.filteredAircraft)
  const selectedIcao = useFlightStore(s => s.selectedIcao)
  const selectAircraft = useFlightStore(s => s.selectAircraft)
  const { theme } = useThemeStore()
  const openPanel = usePanelStore(s => s.openPanel)

  const isDark = theme === 'nasa'

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return

    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      infoBox: false,
      selectionIndicator: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    })

    viewer.imageryLayers.removeAll()
    viewer.imageryLayers.add(new Cesium.ImageryLayer(createImageryProvider(true)))

    viewer.scene.globe.enableLighting = false
    viewer.scene.globe.showGroundAtmosphere = true
    viewer.scene.skyAtmosphere.show = true
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#050d1a')
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a1628')

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
      orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 },
    })

    const billboards = viewer.scene.primitives.add(
      new Cesium.BillboardCollection({ scene: viewer.scene })
    )
    billboardsRef.current = billboards

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = viewer.scene.pick(click.position)
      if (Cesium.defined(picked) && picked.primitive instanceof Cesium.Billboard) {
        const icao = picked.primitive.id as string
        if (icao) {
          selectAircraft(icao)
          openPanel('flightDetail')
        }
      } else {
        selectAircraft(null)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    viewerRef.current = viewer

    return () => {
      handler.destroy()
      if (!viewer.isDestroyed()) viewer.destroy()
      viewerRef.current = null
      billboardsRef.current = null
      icaoToBillboard.current.clear()
    }
  }, [selectAircraft, openPanel])

  // Cambiar mapa según tema
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.imageryLayers.removeAll()
    viewer.imageryLayers.add(new Cesium.ImageryLayer(createImageryProvider(isDark)))
    // Actualizar color de todos los billboards existentes
    icaoToBillboard.current.forEach((bb, icao) => {
      if (icao !== selectedIcao) {
        bb.image = getPlaneSvg(isDark)
      }
    })
  }, [isDark, selectedIcao])

  // Actualizar billboards
  useEffect(() => {
    const billboards = billboardsRef.current
    if (!billboards) return

    const currentIcaos = new Set<string>()

    filteredAircraft.forEach((aircraft: Aircraft) => {
      if (!aircraft.latitude || !aircraft.longitude) return

      const icao = aircraft.icao24
      currentIcaos.add(icao)
      const isSelected = icao === selectedIcao

      const position = Cesium.Cartesian3.fromDegrees(
        aircraft.longitude,
        aircraft.latitude,
        (aircraft.baro_altitude ?? 0) + 1000
      )
      const rotation = Cesium.Math.toRadians(aircraft.true_track ?? 0)
      const scale = isSelected ? 1.6 : 1.1  // más grandes
      const image = isSelected ? getSelectedPlaneSvg() : getPlaneSvg(isDark)

      const existing = icaoToBillboard.current.get(icao)
      if (existing) {
        existing.position = position
        existing.image = image
        existing.rotation = -rotation
        existing.scale = scale
      } else {
        const billboard = billboards.add({
          id: icao,
          position,
          image,
          rotation: -rotation,
          scale,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: Cesium.Cartesian2.ZERO,
          eyeOffset: Cesium.Cartesian3.ZERO,
          scaleByDistance: new Cesium.NearFarScalar(1e4, 1.5, 1e7, 0.6),
          translucencyByDistance: new Cesium.NearFarScalar(1e7, 1.0, 2e7, 0.3),
        })
        icaoToBillboard.current.set(icao, billboard)
      }
    })

    icaoToBillboard.current.forEach((billboard, icao) => {
      if (!currentIcaos.has(icao)) {
        billboards.remove(billboard)
        icaoToBillboard.current.delete(icao)
      }
    })
  }, [filteredAircraft, selectedIcao, isDark])

  // Trazar ruta del avión seleccionado desde los datos del store
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    // Eliminar traza anterior
    if (trackPolylineRef.current) {
      viewer.scene.primitives.remove(trackPolylineRef.current)
      trackPolylineRef.current = null
    }

    if (!selectedIcao) return

    // Obtener posiciones históricas del store (últimas N posiciones)
    const aircraft = useFlightStore.getState().aircraft.get(selectedIcao)
    if (!aircraft || !aircraft.latitude || !aircraft.longitude) return

    // Por ahora mostramos solo la posición actual como punto destacado
    // La trayectoria completa se carga desde la API en FlightDetailPanel
  }, [selectedIcao])

  const flyToAircraft = useCallback((aircraft: Aircraft) => {
    const viewer = viewerRef.current
    if (!viewer || !aircraft.latitude || !aircraft.longitude) return
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        aircraft.longitude,
        aircraft.latitude,
        800000
      ),
      duration: 2,
      orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 },
    })
  }, [])

  useEffect(() => {
    if (!selectedIcao) return
    const aircraft = useFlightStore.getState().aircraft.get(selectedIcao)
    if (aircraft) flyToAircraft(aircraft)
  }, [selectedIcao, flyToAircraft])

  return (
    <div
      ref={containerRef}
      className="cesium-container"
      style={{ position: 'absolute', inset: 0 }}
    />
  )
}