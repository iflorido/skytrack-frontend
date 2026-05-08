import { useEffect, useRef, useCallback } from 'react'
import * as Cesium from 'cesium'
import { useFlightStore } from '../../stores/flightStore'
import { cesiumViewerRef } from '../../stores/globeStore'
import { setTrackDataCallback, TrackData } from '../panels/FlightDetailPanel'
import { useThemeStore } from '../../stores/themeStore'
import { usePanelStore } from '../../stores/panelStore'
import { Aircraft } from '../../types'

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || ''

// SVG de avión con color dinámico
function getPlaneSvg(color: string) {
  return `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
  <path fill="${color}" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
</svg>
`)}`
}

function getAircraftSvgColor(aircraft: Aircraft, selected: boolean, dark: boolean): string {
  if (selected) return '#00ffcc'
  if (aircraft.on_ground) return dark ? '#4a6080' : '#999999'
  if (aircraft.is_climbing) return dark ? '#00d4ff' : '#0066cc'
  if (aircraft.is_descending) return dark ? '#ffaa00' : '#cc6600'
  return dark ? '#ffffff' : '#333333'
}

function createImageryProvider(_dark: boolean) {
  // Mismo mapa base para ambos temas — CartoDB Voyager con buen detalle
  return new Cesium.UrlTemplateImageryProvider({
    url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    minimumLevel: 0,
    maximumLevel: 19,
    credit: '© CartoDB © OpenStreetMap contributors',
  })
}



export default function Globe() {
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const billboardsRef = useRef<Cesium.BillboardCollection | null>(null)
  const icaoToBillboard = useRef<Map<string, Cesium.Billboard>>(new Map())
  const trackPolylineRef = useRef<Cesium.PolylineCollection | null>(null)

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
    // Mapa base con tinte azul NASA — alpha controla la intensidad del tinte
    const baseLayer = new Cesium.ImageryLayer(createImageryProvider(true))
    baseLayer.brightness = 0.45
    baseLayer.saturation = 0.4
    baseLayer.hue = 0.0
    viewer.imageryLayers.add(baseLayer)

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
    cesiumViewerRef.current = viewer

    return () => {
      handler.destroy()
      if (!viewer.isDestroyed()) viewer.destroy()
      viewerRef.current = null
      cesiumViewerRef.current = null
      billboardsRef.current = null
      icaoToBillboard.current.clear()
    }
  }, [selectAircraft, openPanel])

  // Cambiar mapa según tema
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    // Modificar la capa base existente sin recrearla (evita parpadeo)
    if (viewer.imageryLayers.length > 0) {
      const layer = viewer.imageryLayers.get(0)
      if (isDark) {
        layer.brightness = 0.45
        layer.saturation = 0.4
        layer.hue = 0.0
      } else {
        layer.brightness = 1.0
        layer.saturation = 1.0
        layer.hue = 0.0
      }
    }

    // Actualizar color de billboards
    icaoToBillboard.current.forEach((bb, icao) => {
      const ac = useFlightStore.getState().aircraft.get(icao)
      if (ac) {
        bb.image = getPlaneSvg(getAircraftSvgColor(ac, icao === selectedIcao, isDark))
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
      const scale = isSelected ? 1.4 : 1.0
      const color = getAircraftSvgColor(aircraft, isSelected, isDark)
      const image = getPlaneSvg(color)

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

  // Registrar callback para recibir trayectoria desde FlightDetailPanel
  useEffect(() => {
    setTrackDataCallback((data: TrackData | null) => {
      const viewer = viewerRef.current
      if (!viewer) return

      // Eliminar trayectoria anterior
      if (trackPolylineRef.current) {
        viewer.scene.primitives.remove(trackPolylineRef.current)
        trackPolylineRef.current = null
      }

      if (!data || data.waypoints.length < 2) return

      // Construir array de posiciones para la polyline
      const positions: Cesium.Cartesian3[] = []
      data.waypoints.forEach(wp => {
        if (wp.latitude !== null && wp.longitude !== null) {
          positions.push(
            Cesium.Cartesian3.fromDegrees(
              wp.longitude,
              wp.latitude,
              (wp.baro_altitude ?? 0) + 500
            )
          )
        }
      })

      if (positions.length < 2) return

      // Crear polyline con gradiente de color
      const polylines = new Cesium.PolylineCollection()
      polylines.add({
        positions,
        width: 2,
        material: Cesium.Material.fromType('Color', {
          color: Cesium.Color.fromCssColorString('#00d4ff').withAlpha(0.7),
        }),
      })

      viewer.scene.primitives.add(polylines)
      trackPolylineRef.current = polylines
    })

    return () => setTrackDataCallback(null)
  }, [])

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