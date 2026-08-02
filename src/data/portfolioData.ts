import toddCreekGlb from '../assets/3dmodels/todd-creek-wwtp.glb'
import compassFrameGlb from '../assets/3dmodels/compass-minerals-frame.glb'
import johnMcLaughlinGlb from '../assets/3dmodels/john-mclaughlin-renovation.glb'
import model2613_1 from '../assets/3dmodels/2613_1.glb'
import model2613_2 from '../assets/3dmodels/2613_2.glb'
import model2613_3 from '../assets/3dmodels/2613_3.glb'
import model2613_4 from '../assets/3dmodels/2613_4.glb'
import model2613_5 from '../assets/3dmodels/2613_5.glb'
import canopyGlb from '../assets/3dmodels/Canopy.glb'

export interface PortfolioModelItem {
  id: string
  title: string
  software: string
  modelUrl: string
  description: string
}

export const PORTFOLIO_MODELS: PortfolioModelItem[] = [
  {
    id: 'todd-creek-wwtp',
    title: 'Completed Project-01',
    software: 'SDS/2 3D Model',
    modelUrl: toddCreekGlb,
    description: 'Interactive 3D structural steel model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'compass-minerals-frame',
    title: 'Completed Project-02',
    software: 'SDS/2 & Tekla Model',
    modelUrl: compassFrameGlb,
    description: 'Interactive 3D heavy industrial steel frame model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'john-mclaughlin-renovation',
    title: 'Completed Project-03',
    software: 'SDS/2 3D Model',
    modelUrl: johnMcLaughlinGlb,
    description: 'Interactive 3D structural renovation BIM model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'project-2613-1',
    title: 'Completed Project-04',
    software: 'SDS/2 3D Model',
    modelUrl: model2613_1,
    description: 'Interactive 3D structural steel assembly model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'project-2613-2',
    title: 'Completed Project-05',
    software: 'SDS/2 3D Model',
    modelUrl: model2613_2,
    description: 'Interactive 3D commercial structural steel frame model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'project-2613-3',
    title: 'Completed Project-06',
    software: 'SDS/2 3D Model',
    modelUrl: model2613_3,
    description: 'Interactive 3D industrial steel structure model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'project-2613-4',
    title: 'Completed Project-07',
    software: 'SDS/2 3D Model',
    modelUrl: model2613_4,
    description: 'Interactive 3D complex structural framing BIM model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'project-2613-5',
    title: 'Completed Project-08',
    software: 'SDS/2 3D Model',
    modelUrl: model2613_5,
    description: 'Interactive 3D structural steel connection detail model. Drag to rotate, scroll to zoom, right-click to pan.'
  },
  {
    id: 'project-canopy',
    title: 'Completed Project-09',
    software: 'SDS/2 3D Model',
    modelUrl: canopyGlb,
    description: 'Interactive 3D steel canopy structure model. Drag to rotate, scroll to zoom, right-click to pan.'
  }
]
