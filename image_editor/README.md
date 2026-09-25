# AI Image Editor

A web-based image editing application built with a **Python (FastAPI)** backend and a **Vanilla JavaScript/HTML/CSS** frontend. It leverages the power of **OpenCV** to process images in real-time.

## Features

- **Upload & Preview**: Select any image from your computer.
- **Filters**: 
  - Grayscale
  - Sepia
  - Adjustable Gaussian Blur
- **Adjustments**: Modify Brightness and Contrast with live sliders.
- **Transformations**: 
  - Flip horizontally or vertically
  - Rotate by 90-degree increments
- **Undo System**: Step back through your edits one by one, or click **Reset** to restore the original image.
- **Download**: Export your edited masterpiece in one click.

## Tech Stack

- **Backend**: Python, FastAPI, OpenCV (`cv2`), Uvicorn
- **Frontend**: HTML5, CSS3 (Custom Dark Mode UI), Vanilla JavaScript

## Setup and Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd image_editor
   ```

2. **Create a Virtual Environment** (Recommended):
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Open in Browser**:
   Visit `http://localhost:8000` to use the Image Editor.

## Folder Structure

```
image_editor/
├── main.py                # FastAPI backend and OpenCV logic
├── requirements.txt       # Python dependencies
├── .gitignore             # Ignored files for version control
└── static/
    ├── index.html         # User Interface
    ├── style.css          # Styling (Dark mode aesthetic)
    └── script.js          # Client-side logic and API calls
```
