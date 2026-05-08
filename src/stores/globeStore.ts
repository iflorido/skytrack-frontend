import { createRef } from 'react'
import * as Cesium from 'cesium'

// Ref global del viewer de Cesium — compartido entre Globe y MapSettings
export const cesiumViewerRef = createRef<Cesium.Viewer>() as React.MutableRefObject<Cesium.Viewer | null>
