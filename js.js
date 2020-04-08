const image = document.getElementById('image')
const form = document.forms['control']
let canvas = document.getElementById('canImg')
let ctx = canvas.getContext('2d')


// Add Photo
image.addEventListener('change', () => {
    let reader = new FileReader();
    const img = new Image();
    
    reader.addEventListener('load', () => {
        img.src = reader.result
    })
    reader.readAsDataURL(image.files[0])

    img.onload = () => {
        // canvas.height = img.height
        // canvas.width = img.width



        let frac = img.width / img.height
        let newWidth = canvas.width
        let newHeight = canvas.height / frac
        
        if(newHeight > canvas.height) {
            newHeight = canvas.height
            newWidth = canvas.width * frac
        }

        let xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
        let yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight)
    }

})

// Draw variables
let painting = false;
let removing = false;
let drawType = 'free';
let action;

// Text variables
let x = 0, y = 0,
inputText = document.getElementById('text'),
pointer = document.querySelector('.pointer')

// Canvas options
ctx.strokeStyle  = '#000'
ctx.lineWidth = 5;
ctx.font = "30px Arial";
ctx.fillStyle = 'black'
let rectX, rectY

// Draw functions
const draw = (e) => {
    if(!painting) return;
    if(drawType == 'line' || drawType == 'rect')return; 
    
    ctx.lineCap = 'round'
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
}
const startDrawing = (e) => { 
    pointer.style.display = 'none'
    painting = true;

    if(drawType == 'line'){
        ctx.beginPath()
        ctx.moveTo(e.offsetX, e.offsetY)
        return;
    } else if(drawType == 'rect'){
        rectX = e.offsetX;
        rectY = e.offsetY;
    }
    draw(e)
}
const endDrawing = (e) => {
    if(drawType == 'line'){
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    } else if(drawType == 'rect'){
        ctx.fillRect(rectX, rectY, (e.offsetX - rectX), (e.offsetY - rectY));
        // ctx.stroke()
    }
    painting = false;
    ctx.beginPath();
}


// Remove functions
let removeWidth = 5;
const remove = (e) => {
    if(!removing) return;
    ctx.lineCap = 'round'
    ctx.clearRect(e.offsetX, e.offsetY, removeWidth, removeWidth);

}
const startRemoving = (e) => { 
    pointer.style.display = 'none'
    removing = true;
    remove(e)
}
const endRemoving = () => {
    removing = false;
    ctx.beginPath();
}


// text function
const saveText = () => {
    pointer.style.display = 'none'
    ctx.fillText(form.text.value, x, y)
}

const choosePos = (e) => {
    form.text.blur()
    form.text.value = ''

    pointer.style.display = 'block'
    pointer.style.left = e.clientX + 'px'
    pointer.style.top = (e.clientY - 10) + 'px'
    x = e.offsetX;
    y = e.offsetY + 8;
}


const work = () => {
    if(action == 'draw'){
        canvas.removeEventListener('mousedown', choosePos)
        document.getElementById('save').removeEventListener('click', saveText)
        
        canvas.addEventListener('mousedown', startDrawing)
        canvas.addEventListener('mouseup', endDrawing)
        canvas.addEventListener('mousemove', draw)
    } else if(action == 'text') {

        canvas.removeEventListener('mousedown', startDrawing)
        canvas.removeEventListener('mouseup', endDrawing)
        canvas.removeEventListener('mousemove', draw)
        
        canvas.addEventListener('mousedown', choosePos)
        document.getElementById('save').addEventListener('click', saveText)

    } else if(action == 'remove') {

        canvas.removeEventListener('mousedown', startDrawing)
        canvas.removeEventListener('mouseup', endDrawing)
        canvas.removeEventListener('mousemove', draw)
        canvas.removeEventListener('mousedown', choosePos)
        document.getElementById('save').removeEventListener('click', saveText)

        canvas.addEventListener('mousedown', startRemoving)
        canvas.addEventListener('mouseup', endRemoving)
        canvas.addEventListener('mousemove', remove)

    }
}


form.addEventListener('change', () => {
    // Draw and text functions
    ctx.strokeStyle = form.colour.value
    ctx.fillStyle = form.colour.value

    ctx.lineWidth = form.width.value
    removeWidth = form.width.value

    drawType = form.drawType.value

    action = form.action.value
    work()

})

const filterForm = document.forms['filter'];
filterForm.addEventListener('change', () => {
    document.getElementById('canImg').style.filter = `blur(${filterForm.blur.value}px)
                                                        brightness(${filterForm.brightness.value}%)
                                                        contrast(${filterForm.contrast.value}%)
                                                        grayscale(${filterForm.grayscale.value}%)
                                                        hue-rotate(${filterForm.hueRotate.value}deg)
                                                        invert(${filterForm.invert.value}%)
                                                        saturate(${filterForm.saturate.value}%)
                                                        opacity(${filterForm.opacity.value}%)
                                                        sepia(${filterForm.sepia.value}%)
                                                        `
})
        
// document.getElementById('undo').addEventListener('click', () => {
//     // ctx.restore()
//     console.log('het')
//     ctx.rotate(20 * Math.PI / 180);
//     ctx.fillRect(50, 20, 100, 50);
// })