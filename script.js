const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('open')) return;
  if (nav.contains(event.target) || toggle?.contains(event.target)) return;
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
});

document.getElementById('year').textContent = new Date().getFullYear();

const trips = [
  {id:'lost-river-2023', year:'2023', name:'Lost River Valley Campground', place:'North Woodstock, New Hampshire', lat:44.03, lng:-71.69, note:'White Mountains camping and a place worth returning to.'},
  {id:'burlingame-2024', year:'2024', name:'Burlingame State Park Campground', place:'Charlestown, Rhode Island', lat:41.38, lng:-71.70, note:'Coastal camping beside Watchaug Pond.'},
  {id:'lake-compounce-2025', year:'2025', name:'Lake Compounce Campground', place:'Bristol, Connecticut', lat:41.6416, lng:-72.9233, note:'Trail Tater’s first RV weekend, first campground decal and the first state filled on the map.', url:'lake-compounce-2025.html'},
  {id:'gettysburg-2025', year:'2025', name:'Artillery Ridge Campground', place:'Gettysburg, Pennsylvania', lat:39.81, lng:-77.22, note:'The tent-camping trip that inspired Trail Tater.', url:'gettysburg-2025.html'},
  {id:'plymouth-2026', year:'2026', name:'Sandy Pond Campground', place:'Plymouth, Massachusetts', lat:41.82, lng:-70.58, note:'The upcoming Mayflower-ancestor flagship journey.'}
];

const list = document.getElementById('trip-list');
const buttons = [];
trips.slice().reverse().forEach((trip) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'trip-button';
  button.innerHTML = `<span class="trip-year">${trip.year}</span><strong>${trip.name}</strong><span>${trip.place}</span>`;
  list?.appendChild(button);
  buttons.push({button, trip});
});

if (window.L && document.getElementById('travel-map')) {
  document.querySelector('.map-fallback')?.remove();
  const map = L.map('travel-map', {scrollWheelZoom:false}).setView([41.9,-73.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markerByYear = new Map();
  const icon = L.divIcon({
    className:'trail-marker',
    html:'<div style="background:#a84f2a;color:white;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:grid;place-items:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.3)"><span style="transform:rotate(45deg);font-size:16px">🥔</span></div>',
    iconSize:[34,34], iconAnchor:[17,34], popupAnchor:[0,-34]
  });

  trips.forEach((trip) => {
    const marker = L.marker([trip.lat,trip.lng], {icon}).addTo(map);
    marker.bindPopup(`<div class="map-popup"><span class="year">${trip.year}</span><h3>${trip.name}</h3><p><strong>${trip.place}</strong></p><p>${trip.note}</p>${trip.url ? `<p><a href="${trip.url}">Read the full story →</a></p>` : ''}</div>`);
    markerByYear.set(trip.id || `${trip.year}-${trip.name}`, marker);
  });

  const bounds = L.latLngBounds(trips.map(t => [t.lat,t.lng]));
  map.fitBounds(bounds.pad(.25));

  buttons.forEach(({button,trip}) => {
    button.addEventListener('click', () => {
      buttons.forEach(item => item.button.classList.remove('active'));
      button.classList.add('active');
      map.setView([trip.lat,trip.lng], 9, {animate:true});
      markerByYear.get(trip.id || `${trip.year}-${trip.name}`)?.openPopup();
    });
  });
} else {
  const fallback = document.querySelector('.map-fallback');
  if (fallback) fallback.textContent = 'The map could not load, but the campground list is ready below.';
}
