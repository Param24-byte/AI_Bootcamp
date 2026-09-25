import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    from fastapi.responses import FileResponse
    return FileResponse("static/index.html")

@app.post("/process")
async def process_image(
    file: UploadFile = File(...),
    action: str = Form(...),
    value: str = Form(None)
):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return {"error": "Invalid image format"}

    if action == "grayscale":
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
    elif action == "sepia":
        kernel = np.array([[0.272, 0.534, 0.131],
                           [0.349, 0.686, 0.168],
                           [0.393, 0.769, 0.189]])
        img = cv2.transform(img, kernel)
        img = np.clip(img, 0, 255).astype(np.uint8)
        
    elif action == "blur":
        val = int(value) if value and value.isdigit() else 5
        if val % 2 == 0: val += 1
        img = cv2.GaussianBlur(img, (val, val), 0)
        
    elif action == "brightness_contrast":
        # value expected format: "brightness,contrast" e.g., "50,1.2"
        b, c = 0, 1.0
        if value:
            try:
                parts = value.split(',')
                b = int(parts[0])
                c = float(parts[1])
            except:
                pass
        img = cv2.convertScaleAbs(img, alpha=c, beta=b)
        
    elif action == "flip":
        # value: 0 (vertical), 1 (horizontal), -1 (both)
        flip_code = int(value) if value else 1
        img = cv2.flip(img, flip_code)
        
    elif action == "rotate":
        # value: 90, 180, 270
        angle = int(value) if value else 90
        if angle == 90:
            img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif angle == 180:
            img = cv2.rotate(img, cv2.ROTATE_180)
        elif angle == 270:
            img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

    # Encode back to jpeg
    if len(img.shape) == 2:
        # Grayscale back to 3 channels for consistency if needed, but imencode handles it
        pass
        
    is_success, buffer = cv2.imencode(".jpg", img)
    io_buf = io.BytesIO(buffer)
    
    return Response(content=io_buf.getvalue(), media_type="image/jpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
