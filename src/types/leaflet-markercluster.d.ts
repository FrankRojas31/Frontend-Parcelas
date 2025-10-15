declare module 'leaflet' {
  namespace L {
    interface MarkerClusterGroupOptions {
      chunkedLoading?: boolean;
      chunkProgress?: (processed: number, total: number) => void;
      maxClusterRadius?: number;
      disableClusteringAtZoom?: number;
      spiderfyOnMaxZoom?: boolean;
      showCoverageOnHover?: boolean;
      zoomToBoundsOnClick?: boolean;
      spiderfyDistanceMultiplier?: number;
      iconCreateFunction?: (cluster: MarkerCluster) => DivIcon;
    }

    interface MarkerCluster {
      getChildCount(): number;
      getAllChildMarkers(): Marker[];
    }

    function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;

    interface MarkerClusterGroup extends FeatureGroup {
      addLayer(layer: Layer): this;
      removeLayer(layer: Layer): this;
      clearLayers(): this;
    }

    interface MarkerOptions {
      sensorType?: string;
    }
  }
}