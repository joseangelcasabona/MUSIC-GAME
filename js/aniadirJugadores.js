const inputNum = document.getElementById('numJugadores')
    const contenedor = document.getElementById('inputsJugadores')

    inputNum.addEventListener('input', () => {
      const total = parseInt(inputNum.value)
      contenedor.innerHTML = ''

      if (!isNaN(total) && total >= 2 && total <= 8) {
        for (let i = 1; i <= total; i++) {
          const div = document.createElement('div')
          div.className = 'jugador-input'
          div.innerHTML = `
            <label>Jugador ${i}:</label><br>
            <input type="text" name="jugador${i}" required placeholder="Nombre del jugador ${i}">
          `
          contenedor.appendChild(div)
        }
      }
    })