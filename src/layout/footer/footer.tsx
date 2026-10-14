import './footer.css';
import clsx from 'clsx';
import { BiHome } from "react-icons/bi";
import { RiGithubLine } from "react-icons/ri";
import { TbBrandLinkedin } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@components/ui/tooltip";
import { useProfile } from "@src/store/store";


const Footer = () => {
  const formType =  useProfile((state:any) => state.formType);
  return(
    <footer  className={clsx('footer',{'intro':formType === 'login' || formType === 'success'})}>
      <p className='mb-0'><span>Developed by:</span> Aaron Rosales <span>2026</span></p>
      <div className='links'>
        <TooltipProvider delay={200}>
          <Tooltip>
            <TooltipTrigger render={
            <a href="https://ronros96.github.io/portfolio/" target='blank' rel="noopener"><BiHome size={'1.5rem'}/></a>
            } />
            <TooltipContent>
              <p>View my portfolio</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={
            <a href="https://github.com/ronros96" target='blank' rel="noopener"><RiGithubLine size={'1.5rem'}/></a>
            } />
            <TooltipContent>
              <p>GitHub</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={
            <a href="https://www.linkedin.com/in/aaronros/" target='blank' rel="noopener"><TbBrandLinkedin size={'1.5rem'}/></a>
            } />
            <TooltipContent>
              <p>LinkedIn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  )
}
export default Footer;