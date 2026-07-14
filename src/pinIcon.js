import L from "leaflet";

// pins consist of images so divIcon is used for making custom HTML elements.
// works the same but its just HTML instead of an icon.
// https://leafletjs.com/reference.html#divicon

export const pinIcon = L.divIcon({
  className: "event-pin-wrapper",

  html: `
    <div class="event-pin">
      <span class="event-pin__dot"></span>
    </div>
  `,

  iconSize: [28, 38],
  iconAnchor: [14, 38], // bottom of the pin, the supposed location point
  popupAnchor: [0, -36]
});
