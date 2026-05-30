import { GuideStep, BlobFile } from './types';

export const INITIAL_GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    title: 'Cloud Resources Set Up',
    description: 'Explore the virtual Azure Portal. Provision an Azure Function App with Python runtime, and create a Storage Account container named "images".',
    completed: false,
  },
  {
    id: 2,
    title: 'Configure Connection Credentials',
    description: 'Set your secure "AZURE_STORAGE_CONNECTION_STRING" credentials in the Local Environment Variables to authenticate with the Storage Container.',
    completed: false,
  },
  {
    id: 3,
    title: 'Review Serverless Code & Parameters',
    description: 'Inspect the serverless Python code using Pillow (PIL) and the azure-storage-blob library. Try tweaking the target dimensions in the editor.',
    completed: false,
  },
  {
    id: 4,
    title: 'Upload Base Image',
    description: 'Choose or drag-and-drop a high-resolution photo into the virtual "images" storage container under the "original/" folder.',
    completed: false,
  },
  {
    id: 5,
    title: 'Trigger Serverless Function',
    description: 'Run the simulated Python serverless runtime to execute Pillow commands, resize the file, and upload the optimized version back to Azure.',
    completed: false,
  },
  {
    id: 6,
    title: 'Verify Load Optimization',
    description: 'Compare dimensions, file sizes, and load optimization metrics of the original photo vs. the serverless optimized resized photo.',
    completed: false,
  },
];

export const DEFAULT_PYTHON_CODE = `import io
import os
from azure.storage.blob import BlobServiceClient
from PIL import Image

# Azure Storage connection details from environment variable
connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
container_name = "images"  # Name of your container

def main(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    
    try:
        blob_name = req_body.get('blob_name') 
        if not blob_name:
            return func.HttpResponse(
                "Please pass a blob name in the request body",
                status_code=400
            )
    except ValueError:
        return func.HttpResponse(
             "Invalid JSON format in request body",
             status_code=400
        )
        
    # Initialize the Azure Storage Service Blob Client
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    
    # Obtain original image data stream
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    image_data = blob_client.download_blob().readall()
    
    try:
        # Open in memory bytes buffer using Pillow
        image = Image.open(io.BytesIO(image_data))
        
        # Resize image: Tweak these dimensions and watch the simulator update live!
        resized_image = image.resize((500, 500))  
        
        # Save the resized image to an in-memory buffer
        output_buffer = io.BytesIO()
        resized_image.save(output_buffer, format="JPEG")  
        output_buffer.seek(0)
        
        # Upload the resized image back to the "resized/" folder prefix
        resized_blob_name = f"resized/{blob_name}" 
        resized_blob_client = blob_service_client.get_blob_client(container=container_name, blob=resized_blob_name)
        resized_blob_client.upload_blob(output_buffer, overwrite=True)
        
        return func.HttpResponse(f"Image '{blob_name}' resized and saved as '{resized_blob_name}'")
    except Exception as e:
        return func.HttpResponse(f"Error processing image: {str(e)}", status_code=500)
`;

export const REQUIREMENTS_TXT = `azure-storage-blob==12.19.0
Pillow==10.2.0
azure-functions==1.18.0
`;

// Helper visual preset generator for high fidelity mockup images in code
export const PRESETS = [
  {
    id: 'sunset_mountains',
    title: 'Sunset Mountains',
    width: 3840,
    height: 2160,
    originalSize: 4210500, // 4.2 MB
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="40%" stop-color="#311042" />
          <stop offset="70%" stop-color="#be185d" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
        <linearGradient id="mountGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4d1234" />
          <stop offset="100%" stop-color="#180510" />
        </linearGradient>
        <linearGradient id="mountGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <!-- Sky Background -->
      <rect width="1200" height="800" fill="url(#skyGrad)" />
      
      <!-- Big Sun -->
      <circle cx="600" cy="500" r="160" fill="#fef08a" opacity="0.95" filter="blur(2px)"/>
      <circle cx="600" cy="500" r="240" fill="#fb7185" opacity="0.3" filter="blur(20px)"/>

      <!-- Distant Hills -->
      <path d="M 0 540 Q 300 480 600 550 Q 900 620 1200 540 L 1200 800 L 0 800 Z" fill="#9d174d" opacity="0.7" />
      
      <!-- Back Mountains -->
      <polygon points="-50,800 250,380 550,800" fill="url(#mountGrad1)" />
      <polygon points="400,800 750,420 1100,800" fill="url(#mountGrad1)" opacity="0.9" />

      <!-- Foreground Mountain Range -->
      <polygon points="100,800 500,320 900,800" fill="#1e293b" />
      <polygon points="650,800 950,490 1250,800" fill="url(#mountGrad2)" />
      
      <!-- Decorative Pine Silhouettes -->
      <path d="M500,800 L490,750 L495,750 L488,710 L493,710 L485,670 L495,670 L495,650 L505,650 L505,670 L515,670 L507,710 L512,710 L505,750 L510,750 Z" fill="#020617" />
      <path d="M540,800 L532,760 L536,760 L530,720 L534,720 L527,680 L535,680 L535,660 L545,660 L545,680 L553,680 L546,720 L550,720 L544,760 L548,760 Z" fill="#020617" opacity="0.8" transform="scale(0.9) translate(60, 100)" />
      <path d="M430,800 L422,740 L426,740 L420,690 L424,690 L418,650 L426,650 L426,630 L434,630 L434,650 L442,650 L436,690 L440,690 L434,740 L438,740 Z" fill="#020617" opacity="0.95" />
      
      <!-- Ambient mist -->
      <rect x="0" y="700" width="1200" height="100" fill="#fef08a" opacity="0.1" filter="blur(15px)" />
    </svg>`
  },
  {
    id: 'cyberpunk_neon',
    title: 'Neon Cyberpunk Alley',
    width: 4000,
    height: 3000,
    originalSize: 5621400, // 5.6 MB
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
      <defs>
        <linearGradient id="neonBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="50%" stop-color="#090514" />
          <stop offset="100%" stop-color="#13082a" />
        </linearGradient>
      </defs>
      <!-- Base Background -->
      <rect width="1200" height="800" fill="url(#neonBg)" />
      
      <!-- Simulated city wireframes / lines -->
      <line x1="0" y1="400" x2="1200" y2="400" stroke="#ff007f" stroke-width="1" opacity="0.3"/>
      <line x1="0" y1="410" x2="1200" y2="410" stroke="#00f0ff" stroke-width="1" opacity="0.2"/>
      
      <!-- Tall towers in background -->
      <rect x="50" y="200" width="90" height="600" fill="#030712" stroke="#ff007f" stroke-width="1" opacity="0.4" />
      <rect x="200" y="100" width="150" height="700" fill="#020617" stroke="#00f0ff" stroke-width="1" opacity="0.3" />
      <rect x="800" y="150" width="220" height="650" fill="#030712" stroke="#d946ef" stroke-width="1" opacity="0.45" />
      
      <!-- Glowing Ads / Billboards -->
      <rect x="850" y="220" width="120" height="200" fill="#ff007f" opacity="0.1" filter="blur(8px)"/>
      <rect x="850" y="220" width="120" height="200" rx="4" fill="none" stroke="#ff007f" stroke-width="3" />
      <text x="910" y="325" fill="#ff007f" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle" letter-spacing="4">NEON</text>
      
      <rect x="220" y="150" width="110" height="150" fill="#00f0ff" opacity="0.1" filter="blur(10px)"/>
      <rect x="220" y="150" width="110" height="150" rx="4" fill="none" stroke="#00f0ff" stroke-width="2" />
      <text x="275" y="235" fill="#00f0ff" font-family="monospace" font-size="22" font-weight="semibold" text-anchor="middle">PIL</text>
      
      <!-- Central grid lines converging to depth -->
      <path d="M 100 800 L 550 400 M 1100 800 L 650 400 M 0 600 L 1200 600" stroke="#c084fc" stroke-width="2" opacity="0.2" />
      
      <!-- Floating holographic grid or particles -->
      <circle cx="600" cy="400" r="10" fill="#00f0ff" opacity="0.8" />
      <circle cx="400" cy="500" r="4" fill="#ff007f" opacity="0.6" />
      <circle cx="800" cy="480" r="5" fill="#a855f7" opacity="0.7" />
    </svg>`
  },
  {
    id: 'nordic_forest',
    title: 'Nordic Pine Forest',
    width: 6000,
    height: 4000,
    originalSize: 8125000, // 8.1 MB
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
      <defs>
        <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#cbd5e1" />
          <stop offset="50%" stop-color="#f1f5f9" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </linearGradient>
        <linearGradient id="fogGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f1f5f9" stop-opacity="0" />
          <stop offset="100%" stop-color="#f1f5f9" stop-opacity="0.9" />
        </linearGradient>
      </defs>
      <!-- Soft Pale Sky -->
      <rect width="1200" height="800" fill="url(#forestSky)" />
      
      <!-- Subtle Sun -->
      <circle cx="900" cy="200" r="100" fill="#ffffff" opacity="0.6" filter="blur(5px)" />
      
      <!-- Mountain outline -->
      <path d="M -100 500 L 300 250 L 700 480 L 1000 300 L 1300 550" fill="none" stroke="#94a3b8" stroke-width="4" opacity="0.3" />

      <!-- Forest row 1 - deep background Pines -->
      <g fill="#475569" opacity="0.4">
        <polygon points="100,600 70,500 130,500" />
        <polygon points="200,620 160,490 240,490" />
        <polygon points="350,590 310,470 390,470" />
        <polygon points="800,610 750,480 850,480" />
        <polygon points="950,600 905,460 995,460" />
      </g>
      
      <!-- Mist layer -->
      <rect x="0" y="440" width="1200" height="200" fill="url(#fogGrad)" />

      <!-- Forest row 2 - closer Pines -->
      <g fill="#1e293b" opacity="0.8">
        <polygon points="50,700 0,550 100,550" />
        <polygon points="120,720 70,520 170,520" />
        <polygon points="450,680 390,480 510,480" />
        <polygon points="600,690 530,460 670,460" />
        <polygon points="750,710 690,490 810,490" />
        <polygon points="1100,700 1040,510 1160,510" />
      </g>
      
      <!-- Foremost Pine Silhouette on Left -->
      <g fill="#0f172a">
        <polygon points="250,800 150,450 350,450" />
        <polygon points="250,650 170,400 330,400" />
        <polygon points="250,500 190,320 310,320" />
        <rect x="240" y="750" width="20" height="100" />
      </g>
      
      <!-- Delicate birds flying -->
      <path d="M 800,280 Q 805,275 810,280 Q 815,275 820,280" fill="none" stroke="#475569" stroke-width="2" />
      <path d="M 830,260 Q 835,255 840,260 Q 845,255 850,260" fill="none" stroke="#475569" stroke-width="2" />
      <path d="M 770,295 Q 775,290 780,295 Q 785,290 790,295" fill="none" stroke="#475569" stroke-width="1.5" />
    </svg>`
  }
];

// Simple helper to parse the resize python code dynamically via JavaScript regex to find Pillow target sizing
export function parsePythonResizeDimensions(code: string): { width: number; height: number } {
  try {
    // Looks for image.resize((width, height)) or image.resize( (width, height) )
    const regex = /\.resize\(\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*\)/;
    const match = code.match(regex);
    if (match) {
      return {
        width: parseInt(match[1]),
        height: parseInt(match[2]),
      };
    }
  } catch (e) {
    console.error('Failed to parse python resize dimensions from string:', e);
  }
  return { width: 500, height: 500 }; // fallback
}

// Convert SVG strings to DataURIs to render them properly in standard <img> tags with referrerPolicy or regular src.
export function svgToDataUri(svgString: string): string {
  const cleaned = svgString.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
}
