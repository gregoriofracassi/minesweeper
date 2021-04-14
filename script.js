const cells = document.querySelectorAll('.cell')
const h = 14
const w = 15
const minesNum = 30

const setPositions = () => {
    for (i=0; i < cells.length; i++) {
        cells[i].setAttribute('data-position', i)
    }
}
setPositions()

const setMines = () => {
    const randomCells = []
    while (randomCells.length < minesNum) {
        randCell = cells[Math.round(Math.random()*(cells.length-1))] //inspect edge case with .round in incremBl
        if  (!randomCells.includes(randCell)) {
            randCell.setAttribute('data-mine', 'yes')
            randCell.innerHTML = '<i class="fas fa-bomb"></i>'
            randomCells.push(randCell)
        }
    }
}
setMines()

const findCellType = (index) => {
    typeOfCell = ""
    if (index === 0) {
        typeOfCell = 'tl-corner'
    } else if (index === w-1) {
        typeOfCell = 'tr-corner'   
    } else if (index === w*h-w) {
        typeOfCell = 'bl-corner'   
    } else if (index === w*h-1) {
        typeOfCell = 'br-corner'   
    } else if (index%w === 0 && typeOfCell !== 'tl-corner' && typeOfCell !== 'bl-corner') {
        typeOfCell = 'l-side'
    } else if (index > 0 && index < w-1) {
        typeOfCell = 't-side'
    } else if ((index+1)%w === 0) {
        typeOfCell = 'r-side'
    } else if (index > w*h-w && index < w*h-1) {
        typeOfCell = 'b-side'
    } else {
        typeOfCell = 'norm-cell'
    }
    return typeOfCell
}

const setCellType = () => {
    for (i=0; i<cells.length; i++) {
        cells[i].setAttribute('data-celltype', findCellType(i))
    }
}
setCellType()

const aroundPos = (ind) => {
    let obj = {
        tlInd: ind-w-1,
        tInd: ind-w,
        trInd: ind-w+1,
        lInd: ind-1,
        rInd: ind+1,
        blInd: ind+w-1,
        bInd: ind+w,
        brInd: ind+w+1
    }
    return obj
}

const getaroundPos = (ind) => {
    let arr = []
    switch (cells[ind].dataset.celltype) {
        case 'tl-corner': arr = [aroundPos(ind).rInd, aroundPos(ind).bInd, aroundPos(ind).brInd]
        break
        case 't-side': arr = [aroundPos(ind).lInd, aroundPos(ind).rInd, aroundPos(ind).blInd, aroundPos(ind).bInd, aroundPos(ind).brInd]
        break
        case 'tr-corner': arr = [aroundPos(ind).lInd, aroundPos(ind).blInd, aroundPos(ind).bInd]
        break
        case 'l-side': arr = [aroundPos(ind).tInd, aroundPos(ind).trInd, aroundPos(ind).rInd, aroundPos(ind).bInd, aroundPos(ind).brInd]
        break
        case 'r-side': arr = [aroundPos(ind).tlInd, aroundPos(ind).tInd, aroundPos(ind).lInd, aroundPos(ind).blInd, aroundPos(ind).bInd]
        break
        case 'bl-corner': arr = [aroundPos(ind).tInd, aroundPos(ind).trInd, aroundPos(ind).rInd]
        break
        case 'b-side': arr = [aroundPos(ind).tlInd, aroundPos(ind).tInd, aroundPos(ind).trInd, aroundPos(ind).lInd, aroundPos(ind).rInd]
        break
        case 'br-corner': arr = [aroundPos(ind).tlInd, aroundPos(ind).tInd, aroundPos(ind).lInd]
        break
        default: arr = [aroundPos(ind).tlInd, aroundPos(ind).tInd, aroundPos(ind).trInd, aroundPos(ind).lInd, aroundPos(ind).rInd, aroundPos(ind).blInd, aroundPos(ind).bInd, aroundPos(ind).brInd]
    }
    return arr
}


// refactor first part and switch
const setNumbers = () => { 
    const increm = (x) => {
        if (cells[x].dataset.mine !== 'yes') {
            cells[x].dataset.mine = parseInt(cells[x].dataset.mine) + 1
        }
    }
    cells.forEach (
        (c, i) => {
            if (c.dataset.mine === 'yes') {
                getaroundPos(i).forEach ( ind => increm(ind))
            }
        }
    )
}
setNumbers()

const displayNums = () => {
    cells.forEach (
        c => {
            if (c.dataset.mine !== '0' && c.dataset.mine !== 'yes') {
                c.innerHTML = c.dataset.mine
            }
        }
    )
}
displayNums()

const colorNums = () => {
    cells.forEach (
        c => {
            switch (parseInt(c.dataset.mine)) {
                case 1: c.style.color = 'blue'
                break
                case 2: c.style.color = 'green'
                break
                case 3: c.style.color = 'red'
                break
                case 4: c.style.color = 'purple'
                break
            }
        }
    )
}
colorNums()

const addOverlay = () => {
    cells.forEach (
        c =>
        c.classList.add('overlay')
    )
}
addOverlay()


const removeOverlays = (ind) => {
    let adjCellsInd = getaroundPos(ind)
    cells[ind].classList.remove('overlay')
    cells[ind].setAttribute('data-status', 'clicked')
    emptyAdjCells = []
    
    if (parseInt(cells[ind].dataset.mine) === 0) {
        cells[ind].dataset.mine = 'done' // IMPORTANT LINE
        adjCellsInd.forEach (
            index => {
                cells[index].classList.remove('overlay')
                cells[index].setAttribute('data-status', 'clicked')
                if (parseInt(cells[index].dataset.mine) === 0) {
                    emptyAdjCells.push(index)
                }
            } 
        )
    }
    emptyAdjCells.forEach (
        emptyCellInd => {
            removeOverlays(emptyCellInd)
        }
    )
}

const callOverlaysOnClick = (e) => {
    removeOverlays(parseInt(e.target.dataset.position))
}

cells.forEach (c => c.onclick = callOverlaysOnClick)

const addFlag = (e) => {
    if (e.currentTarget.dataset.status !== 'clicked' && e.currentTarget.dataset.flagStatus !== 'flagged') {
        e.currentTarget.setAttribute('data-flag-status', 'flagged')
        const flagDiv = document.createElement('div')
        e.currentTarget.appendChild(flagDiv)
        flagDiv.classList.add('flag-div')
        flagDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i>'
    } else if (e.currentTarget.dataset.flagStatus === 'flagged') {
        e.currentTarget.dataset.flagStatus = 'unflagged'
        const subArr = e.currentTarget.children
        subArr[0].className === 'flag-div' ? subArr[0].remove() : subArr[1].remove()
        // check for e.currentTarget.children sometimes including as first the <i> tag, that should be appended to child div
    }
    countFlags()
}

cells.forEach (c => c.addEventListener('contextmenu', (e) => {e.preventDefault()}))
cells.forEach (c => c.addEventListener('contextmenu', addFlag))

const countFlags = () => {
    let flags = document.querySelectorAll('.flag-div')
    console.log(minesNum - flags.length)
    return minesNum - flags.length
}
