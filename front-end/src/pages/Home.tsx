import { NavLink } from 'react-router-dom'
import image from '../assets/tela-inicial-totem-fitness.png'


export default function Home() {
  return (
    <div className="w-full h-full overflow-hidden">
      <NavLink to="/formulario">
        <img
        src={image}
        className="w-full h-screen object-contain">
        </img>
      </NavLink>
    </div>
  )
}