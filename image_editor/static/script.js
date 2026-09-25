const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const placeholderText = document.querySelector('.placeholder-text');
const actionBtns = document.querySelectorAll('.action-btn');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const downloadBtn = document.getElementById('downloadBtn');

let originalImageFile = null;
let currentImageBlob = null;
let history = [];

// Sliders updates
document.getElementById('blurSlider').addEventListener('input', (e) => document.getElementById('blurVal').innerText = e.target.value);
document.getElementById('brightnessSlider').addEventListener('input', (e) => document.getElementById('brightnessVal').innerText = e.target.value);
document.getElementById('contrastSlider').addEventListener('input', (e) => document.getElementById('contrastVal').innerText = e.target.value);

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        originalImageFile = file;
        history = [];
        showImage(file);
    }
});

function showImage(source) {
    const url = URL.createObjectURL(source);
    previewImage.src = url;
    previewImage.style.display = 'block';
    placeholderText.style.display = 'none';
    currentImageBlob = source;
}

actionBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        if (!currentImageBlob) {
            alert('Please upload an image first!');
            return;
        }

        const action = btn.dataset.action;
        let value = btn.dataset.value || null;

        if (btn.dataset.source === 'blurSlider') {
            value = document.getElementById('blurSlider').value;
        } else if (btn.dataset.source === 'multi') {
            const b = document.getElementById('brightnessSlider').value;
            const c = document.getElementById('contrastSlider').value;
            value = `${b},${c}`;
        }

        const formData = new FormData();
        // Send the current modified image for sequential edits
        formData.append('file', currentImageBlob, 'image.jpg');
        formData.append('action', action);
        if (value !== null) formData.append('value', value);

        try {
            if (!btn.dataset.originalText) {
                btn.dataset.originalText = btn.innerText;
            }
            btn.innerText = 'Processing...';
            btn.disabled = true;

            const response = await fetch('/process', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                history.push(currentImageBlob);
                showImage(blob);
            } else {
                alert('Error processing image');
            }
        } catch (error) {
            console.error(error);
            alert('Network error');
        } finally {
            if (btn.dataset.originalText) {
                btn.innerText = btn.dataset.originalText;
            }
            btn.disabled = false;
        }
    });
});

resetBtn.addEventListener('click', () => {
    if (originalImageFile) {
        history = [];
        showImage(originalImageFile);
        
        // Reset sliders
        document.getElementById('blurSlider').value = 5;
        document.getElementById('blurVal').innerText = '5';
        document.getElementById('brightnessSlider').value = 0;
        document.getElementById('brightnessVal').innerText = '0';
        document.getElementById('contrastSlider').value = 1.0;
        document.getElementById('contrastVal').innerText = '1.0';
    }
});

undoBtn.addEventListener('click', () => {
    if (history.length > 0) {
        const previousBlob = history.pop();
        showImage(previousBlob);
    }
});

downloadBtn.addEventListener('click', () => {
    if (currentImageBlob) {
        const url = URL.createObjectURL(currentImageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited_image.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
