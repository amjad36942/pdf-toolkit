# PDF Toolkit

**All-in-One Document Converter & PDF Tools** — Free, open-source, and deployable anywhere.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://amjad36942.github.io/pdf-toolkit/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Features

- PDF to Word (.docx) | Word to PDF
- - Images to PDF | PDF to Images (ZIP)
  - - PowerPoint to PDF | PDF to PowerPoint
    - - Merge PDF | Split PDF | Delete Pages
      - - Compress PDF | Add Watermark | Rotate PDF | Edit PDF (text overlay)
       
        - ## Tech Stack
       
        - - **Backend**: Python 3.11 + FastAPI + PyMuPDF + python-docx + python-pptx
          - - **Frontend**: React 18 + Vite + Tailwind CSS
            - - **Libraries**: PyMuPDF, Pillow, python-docx, python-pptx, LibreOffice (CLI)
             
              - ## Quick Start
             
              - ### Backend
              - ```bash
                cd backend
                pip install -r requirements.txt
                # Install LibreOffice for Word/PPTX conversion:
                # sudo apt-get install -y libreoffice
                uvicorn app.main:app --reload --port 8000
                ```
                API docs: http://localhost:8000/docs

                ### Frontend
                ```bash
                cd frontend
                npm install
                npm run dev
                ```
                App: http://localhost:5173/pdf-toolkit/

                ## Deployment

                ### Frontend (GitHub Pages)
                1. Go to **Settings > Pages** in this repo
                2. 2. Set source to `gh-pages` branch
                   3. 3. Push to `main` — the workflow auto-deploys
                     
                      4. **Live URL**: https://amjad36942.github.io/pdf-toolkit/
                     
                      5. ### Backend (Render.com — Free)
                      6. 1. Connect this repo to [render.com](https://render.com)
                         2. 2. Set root directory to `backend/`
                            3. 3. Build command: `pip install -r requirements.txt`
                               4. 4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
                                  5. 5. Add env var: `FRONTEND_URL=https://amjad36942.github.io`
                                    
                                     6. After deploying the backend, set the `VITE_API_URL` secret in GitHub to your Render URL.
                                    
                                     7. ## API Endpoints
                                    
                                     8. | Method | Endpoint | Description |
                                     9. |--------|----------|-------------|
                                     10. | GET | /api/health | Health check |
                                     11. | POST | /api/pdf-to-word | PDF → Word |
                                     12. | POST | /api/word-to-pdf | Word → PDF |
                                     13. | POST | /api/images-to-pdf | Images → PDF |
                                     14. | POST | /api/pdf-to-images | PDF → Images ZIP |
                                     15. | POST | /api/pptx-to-pdf | PPTX → PDF |
                                     16. | POST | /api/pdf-to-pptx | PDF → PPTX |
                                     17. | POST | /api/merge-pdf | Merge PDFs |
                                     18. | POST | /api/split-pdf | Split PDF → ZIP |
                                     19. | POST | /api/delete-pages | Delete pages |
                                     20. | POST | /api/compress-pdf | Compress PDF |
                                     21. | POST | /api/watermark-pdf | Add watermark |
                                     22. | POST | /api/rotate-pdf | Rotate pages |
                                     23. | POST | /api/edit-pdf | Add text overlay |
                                    
                                     24. ## Security
                                    
                                     25. - No permanent file storage — files deleted within 10 minutes
                                         - - File type validation on every endpoint
                                           - - 50MB max file size
                                             - - CORS configured for GitHub Pages origin
                                              
                                               - ## License
                                              
                                               - MIT — free to use, modify, and deploy.
