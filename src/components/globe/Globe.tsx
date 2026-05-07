import { useEffect, useRef, useCallback } from 'react'
import * as Cesium from 'cesium'
import { useFlightStore } from '../../stores/flightStore'
import { useThemeStore } from '../../stores/themeStore'
import { usePanelStore } from '../../stores/panelStore'
import { Aircraft } from '../../types'
import { getAircraftColor } from '../../utils/formatters'

// Token de Cesium Ion
Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || ''

// Icono SVG de avión codificado como data URL
const PLANE_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="white" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
</svg>
`)}`

export default function Globe() {
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const billboardsRef = useRef<Cesium.BillboardCollection | null>(null)
  const icaoToBillboard = useRef<Map<string, Cesium.Billboard>>(new Map())

  const filteredAircraft = useFlightStore(s => s.filteredAircraft)
  const selectedIcao = useFlightStore(s => s.selectedIcao)
  const selectAircraft = useFlightStore(s => s.selectAircraft)
  const { theme } = useThemeStore()
  const openPanel = usePanelStore(s => s.openPanel)

  // Inicializar Cesium
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return

    const viewer = new Cesium.Viewer(containerRef.current, {
      // Imagen base según tema
      baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.IonImageryProvider.fromAssetId(3954)  // Bing Maps Dark (NASA-like)
      ),
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
      // Terreno
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    })

    // Configuración del globo
    viewer.scene.globe.enableLighting = true
    viewer.scene.globe.showGroundAtmosphere = true
    viewer.scene.skyAtmosphere.show = true
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#050d1a')

    // Configuración de cámara inicial — vista global desde espacio
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
      orientation: {
        heading: 0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0,
      },
    })

    // Crear colección de billboards para los aviones
    const billboards = viewer.scene.primitives.add(
      new Cesium.BillboardCollection({ scene: viewer.scene })
    )
    billboardsRef.current = billboards

    // Click en el globo para seleccionar avión
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
      if (!viewer.isDestroyed()) {
        viewer.destroy()
      }
      viewerRef.current = null
      billboardsRef.current = null
      icaoToBillboard.current.clear()
    }
  }, [selectAircraft, openPanel])

  // Actualizar tema del mapa
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const assetId = theme === 'nasa' ? 3954 : 2  // Dark / Natural Earth
    Cesium.IonImageryProvider.fromAssetId(assetId).then(provider => {
      if (viewer.isDestroyed()) return
      viewer.imageryLayers.removeAll()
      viewer.imageryLayers.addImageryProvider(provider)
    }).catch(() => {
      // fallback silencioso
    })
  }, [theme])

  // Actualizar billboards de aviones
  useEffect(() => {
    const billboards = billboardsRef.current
    if (!billboards) return

    const currentIcaos = new Set<string>()

    filteredAircraft.forEach((aircraft: Aircraft) => {
      if (!aircraft.latitude || !aircraft.longitude) return

      const icao = aircraft.icao24
      currentIcaos.add(icao)

      const position = Cesium.Cartesian3.fromDegrees(
        aircraft.longitude,
        aircraft.latitude,
        (aircraft.baro_altitude ?? 0) + 1000
      )

      const color = Cesium.Color.fromCssColorString(
        getAircraftColor(aircraft, icao === selectedIcao)
      )

      const rotation = Cesium.Math.toRadians(aircraft.true_track ?? 0)

      const existing = icaoToBillboard.current.get(icao)
      if (existing) {
        existing.position = position
        existing.color = color
        existing.rotation = -rotation
        existing.scale = icao === selectedIcao ? 1.4 : 0.8
      } else {
        const billboard = billboards.add({
          id: icao,
          position,
          image: PLANE_SVG,
          color,
          rotation: -rotation,
          scale: 0.8,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: Cesium.Cartesian2.ZERO,
          eyeOffset: Cesium.Cartesian3.ZERO,
          scaleByDistance: new Cesium.NearFarScalar(1e4, 1.2, 1e7, 0.4),
          translucencyByDistance: new Cesium.NearFarScalar(1e7, 1.0, 2e7, 0.2),
        })
        icaoToBillboard.current.set(icao, billboard)
      }
    })

    // Eliminar aviones que ya no están en el feed
    icaoToBillboard.current.forEach((billboard, icao) => {
      if (!currentIcaos.has(icao)) {
        billboards.remove(billboard)
        icaoToBillboard.current.delete(icao)
      }
    })
  }, [filteredAircraft, selectedIcao])

  // Volar a avión seleccionado
  const flyToAircraft = useCallback((aircraft: Aircraft) => {
    const viewer = viewerRef.current
    if (!viewer || !aircraft.latitude || !aircraft.longitude) return

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        aircraft.longitude,
        aircraft.latitude,
        500000
      ),
      duration: 2,
      orientation: {
        heading: 0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0,
      },
    })
  }, [])

  // Volar al avión seleccionado cuando cambia la selección
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
