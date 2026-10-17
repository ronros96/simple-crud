import './about.css';

import {
  UserPlus,
  UserSearch,
  UserCog,
  ArchiveRestore,
  MonitorSmartphone,
  SunMoon,
  DatabaseX,
  ListTodo,
  KeyRound,
  Cog,
  GitFork
} from "lucide-react";
import { FaReact } from "react-icons/fa";
import { SiShadcnui } from "react-icons/si";
import { 
  RiTailwindCssFill,
  RiGithubLine 
} from "react-icons/ri";
import { 
  TbBrandVite, 
  TbBrandTypescript 
} from "react-icons/tb";

const About = () => {
  const Divider = () => {
    return <div className='divider'></div>
  }

  return (
    <section className='container header-margin about'>
      <title>{`${import.meta.env.VITE_APP_TITLE} | About`}</title>
      <h1 className='header-3'>
        Simple CRUD System<br />
        <span className="header-6">Developed by <a href="https://ronros96.github.io/portfolio/" target="_blank" rel="noopener" role="link">Aaron Rosales</a></span>
      </h1>
      <h3 className='header-4'>Greetings!</h3>
      <p>Thank you for taking the time to explore my Simple CRUD System!</p>
      <p>This project demonstrates the fundamentals of <strong>Create, Read, Update, and Delete (CRUD)</strong> operations using React as the primary framework, with a few extra features to make the experience more interactive.</p>
      <p>Powered by <a href="https://mockapi.io/" target="_blank" rel="noopener" role="link">MockAPI.io</a> as its REST API provider, this application lets you experiment with user management, from registering and updating accounts to deleting existing users, including the preloaded dummy accounts.</p>
      <h4 className='header-5'>Features</h4>
      <ul className='grid grid-cols-2 md:grid-cols-3'>
        <li>
          <h5>
            <UserPlus />
            Create Accounts
          </h5>
          <Divider />
          Register new accounts and add them to the system.
        </li>
        <li>
          <h5>
            <UserSearch />
            View and Search Users
          </h5>
          <Divider />
          Browse user records and find specific accounts using the available search filters.
        </li>
        <li>
          <h5>
            <UserCog />
            Maintain User Accounts
          </h5>
          Edit or remove existing users individually or in bulk.
        </li>
        <li>
          <h5>
            <ArchiveRestore />
            Restore Dummy Data
          </h5>
          <Divider />
          Restore the original dummy accounts when the dataset has been emptied. Please note that this feature does not recover accounts you created yourself.
        </li>
        <li>
          <h5>
            <MonitorSmartphone />
            Fully Responsive Design
          </h5>
          <Divider />
          Built with a mobile-first approach to provide a consistent and user-friendly experience across mobile phones, tablets, laptops, and desktop screens.
        </li>
        <li>
          <h5>
            <SunMoon />
            Dual Theme Mode
          </h5>
          <Divider />
          Switch between Light and Dark modes for a more comfortable and personalized browsing experience.
        </li>
      </ul>
      <h4 className='header-5'>Limitations and Considerations</h4>
      <p>This project uses a free, web-based REST API service for demonstration purposes. Please keep the following limitations in mind:</p>
      <ul className='grid grid-cols-2'>
        <li>
          <h5>
            <DatabaseX />
            Limited to 100 Accounts
          </h5>
          <Divider />
          The application is designed to work with a maximum of 100 accounts, keeping the dataset manageable for testing and demonstration.
        </li>
        <li>
          <h5>
            <ListTodo />
            Bulk Deletion Limit
          </h5>
          <Divider />
          Bulk deletion is limited to 15 accounts per operation to help manage API requests and avoid unnecessary traffic.
        </li>
        <li>
          <h5>
            <KeyRound />
            Basic Security
          </h5>
          <Divider />
          This is a demonstration project, not a production-ready user management system. Advanced security features, such as two-factor authentication (2FA), are not implemented. Avoid using real personal information or passwords.
        </li>
        <li>
          <h5>
            <Cog />
            Demo Data Only
          </h5>
          <Divider />
          The application is intended for experimentation and showcasing CRUD functionality, rather than storing sensitive or critical user data.
        </li>
      </ul>
      <h4 className='header-5'>Technologies Used</h4>
      <ul className='grid grid-cols-1'>
        <li>
          <h5>
            (<a href="https://react.dev/" target="_blank" rel="noopener" role="link"><FaReact size={20} /> React</a> + <a href="https://react.dev/" target="_blank" rel="noopener" role="link"><TbBrandVite size={20} /> Vite</a>)
            in <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener" role="link"><TbBrandTypescript size={20}/> TypeScript</a>
          </h5>
          A modern web development stack that combines React for building interactive user interfaces, Vite for fast development and optimized builds, and TypeScript for type safety and more reliable code. Together, they provide a fast, scalable, and maintainable foundation for developing responsive web applications.
          <Divider />
          Some Components Used:
          <ul className='grid grid-cols-3 max-w-[30rem] justify-items-center'>
            <li>
              <h6>
                <div className='zustandLogo'></div>
                <a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noopener" role="link">Zustand</a>
              </h6>
              State Manager
            </li>
            <li>
              <h6>
                <SiShadcnui size={20} />
                <a href="https://ui.shadcn.com/" target="_blank" rel="noopener" role="link">ShadCN</a>
              </h6>
              UI library
            </li>
            <li>
              <h6>
                <RiTailwindCssFill size={20} />
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener" role="link">Tailwind</a>
              </h6>
              CSS Framework
            </li>
          </ul>
        </li>
        <li>
          <h6>
            <p className='pacifico-regular'>mockapi.io</p>
            <a href="https://mockapi.io/" target="_blank" rel="noopener" role="link">MockAPI.io</a>
          </h6>
          REST API service for storing and managing demo user records.
        </li>
      </ul>
      <h4 className='header-5'>Explore and Experiment!</h4>
      <p>Feel free to test the available features, explore the interface, and see how CRUD operations work in practice.</p>
      <p>You're also welcome to clone the repository, inspect the code, and build upon the project to suit your own needs.</p>
      <p>Thanks for checking out my work. Happy exploring!</p>
      <a href="https://github.com/ronros96/simple-crud" target="_blank" rel="noopener" role="link" className='git-button'>
        <span>
          <GitFork size={20}/> Fork
        </span>
        <span>
          <RiGithubLine size={20}/>
          github.com/ronros96
        </span>
      </a>
    </section>
  )
}
export default About