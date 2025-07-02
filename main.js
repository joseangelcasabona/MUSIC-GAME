// script.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://naobelbuyyfadpdbttna.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hb2JlbGJ1eXlmYWRwZGJ0dG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTAyMDUsImV4cCI6MjA2Njk4NjIwNX0.ZnMZyh2OZCltP-x0VRZ-UaDSsuR1RKkV42PP2KADC7M'
const supabase = createClient(supabaseUrl, supabaseKey)

const btn = document.getElementById('btn')
const resetBtn = document.getElementById('reset')
const carta = document.getElementById('carta')
const inner = document.getElementById('inner')
const grid = document.getElementById('gridJugadas')

const colores = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#C77DFF']

let cartaActual = null

async function actualizarTablaJugadas() {
  const { data, error } = await supabase
    .from('canciones')
    .select('*')
    .eq('jugado', true)

  if (!error) {
    grid.innerHTML = ''
    data.forEach(cancion => {
      const div = document.createElement('div')
      div.className = 'grid-card'
      div.innerHTML = `
        <div class="inner">
          <div class="front">
            <img src="${cancion.qrimg}" alt="QR">
          </div>
          <div class="back">
            <div class="song">${cancion.nombre_cancion}</div>
            <div class="year">${cancion.año}</div>
            <div class="artist">${cancion.artista}</div>
          </div>
        </div>
      `
      const color = cancion.color || '#eee'
      div.querySelector('.back').style.backgroundColor = color
      div.addEventListener('click', () => {
        div.classList.toggle('rotated')
      })
      grid.appendChild(div)
    })
  }
}

btn.addEventListener('click', async () => {
  carta.classList.remove('rotated')
  inner.classList.add('hidden')

  const { data, error } = await supabase
    .from('canciones')
    .select('*')
    .eq('jugado', false)

  if (error || data.length === 0) {
    alert('No hay más cartas disponibles')
    return
  }

  const aleatoria = data[Math.floor(Math.random() * data.length)]
  cartaActual = aleatoria

  document.getElementById('qr').onload = () => {
    carta.style.display = 'block'
    inner.classList.remove('hidden')
  }
  document.getElementById('qr').src = aleatoria.qrimg
  document.getElementById('titulo').textContent = aleatoria.nombre_cancion
  document.getElementById('artista').textContent = aleatoria.artista
  document.getElementById('año').textContent = aleatoria.año

  let color = aleatoria.color
  if (!color) {
    color = colores[Math.floor(Math.random() * colores.length)]
    await supabase.from('canciones').update({ color }).eq('id', aleatoria.id)
  }
  document.querySelector('.card .back').style.backgroundColor = color

  actualizarTablaJugadas()
})

carta.addEventListener('click', async () => {
  if (!cartaActual) return

  const yaRotada = carta.classList.contains('rotated')
  carta.classList.toggle('rotated')

  if (!yaRotada) {
    await supabase
      .from('canciones')
      .update({ jugado: true })
      .eq('id', cartaActual.id)

    actualizarTablaJugadas()
  }
})

resetBtn.addEventListener('click', async () => {
  const { error } = await supabase
    .from('canciones')
    .update({ jugado: false })
    .neq('jugado', false)

  if (!error) {
    alert('Juego reiniciado. Todas las cartas están disponibles.')
    carta.style.display = 'none'
    carta.classList.remove('rotated')
    cartaActual = null
    actualizarTablaJugadas()
  } else {
    alert('Hubo un error al reiniciar.')
  }
})

actualizarTablaJugadas()
