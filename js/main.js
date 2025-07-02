import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://naobelbuyyfadpdbttna.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hb2JlbGJ1eXlmYWRwZGJ0dG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTAyMDUsImV4cCI6MjA2Njk4NjIwNX0.ZnMZyh2OZCltP-x0VRZ-UaDSsuR1RKkV42PP2KADC7M'
const supabase = createClient(supabaseUrl, supabaseKey)

const grid = document.getElementById('grid')

//Cargar coleccion completa
async function cargarColeccion() {
    const { data, error } = await supabase
        .from('canciones')
        .select('*')
        .order('nombre_cancion', { ascending: true })

    if (error) {
        console.error('Error al cargar canciones:', error)
        grid.innerHTML = '<p>Error al cargar la colección.</p>'
        return
    }

    data.forEach(cancion => {
        const div = document.createElement('div')
        div.className = 'grid-card'

        div.innerHTML = `
          <div class="inner">
            <div class="front">
              <div class="song">${cancion.nombre_cancion || 'Sin título'}</div>
              <div class="year">${cancion.año || '¿?'}</div>
              <div class="artist">${cancion.artista || 'Artista desconocido'}</div>
            </div>
            <div class="back">
              <img src="${cancion.qrimg}" alt="QR">
            </div>
          </div>
        `
        const colorFront = cancion.color
        const colorBack = cancion.color
        div.querySelector('.front').style.backgroundColor = colorFront
        div.querySelector('.back').style.backgroundColor = colorBack
        div.addEventListener('click', () => {
            div.classList.toggle('rotated')
        })

        grid.appendChild(div)
    })
}

cargarColeccion()

//Resetear todas las cartas
const resetearCartas = async () => {
  const { error } = await supabase
    .from('canciones')
    .update({ jugado: false, propietario: null })
    .neq('jugado', false) // o .not('propietario', 'is', null) para asegurar todo

  if (error) {
    showPopup('❌ Error al resetear las cartas.')
    console.error(error)
  } else {
    showPopup('✅ Cartas reseteadas correctamente.')
    // Puedes refrescar la colección si quieres
    if (typeof cargarColeccion === 'function') {
      cargarColeccion()
    }
  }
}

document.getElementById('btnReset').addEventListener('click', resetearCartas)

//Pop up genérico
function showPopup(message) {
  const popup = document.createElement('div')
  popup.textContent = message
  popup.style.position = 'fixed'
  popup.style.top = '80%'
  popup.style.left = '50%'
  popup.style.transform = 'translate(-50%, -50%)'
  popup.style.background = '#000'
  popup.style.color = '#fff'
  popup.style.padding = '1rem 2rem'
  popup.style.borderRadius = '10px'
  popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.4)'
  popup.style.zIndex = '9999'
  popup.style.opacity = '0'
  popup.style.transition = 'opacity 0.4s ease'

  document.body.appendChild(popup)
  setTimeout(() => (popup.style.opacity = '1'), 50)
  setTimeout(() => {
    popup.style.opacity = '0'
    setTimeout(() => popup.remove(), 400)
  }, 2000)
}