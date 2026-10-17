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
import { RiTailwindCssFill } from "react-icons/ri";
import { RiGithubLine } from "react-icons/ri";

const About = () => {
  const Divider = () => {
    return <div className='divider'></div>
  }

  const Motion = () =>{
    return <svg width="33" height="20" viewBox="0 0 25.364 9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M 9.587 0 L 4.57 9 L 0 9 L 3.917 1.972 C 4.524 0.883 6.039 0 7.301 0 Z M 20.794 2.25 C 20.794 1.007 21.817 0 23.079 0 C 24.341 0 25.364 1.007 25.364 2.25 C 25.364 3.493 24.341 4.5 23.079 4.5 C 21.817 4.5 20.794 3.493 20.794 2.25 Z M 10.443 0 L 15.013 0 L 9.997 9 L 5.427 9 Z M 15.841 0 L 20.411 0 L 16.494 7.028 C 15.887 8.117 14.372 9 13.11 9 L 10.825 9 Z" fill="currentColor"></path></svg>
  }

  return (
    <section className='container header-margin about'>
      <title>{`${import.meta.env.VITE_APP_TITLE} | About`}</title>
      <h1 className='header-3'>
        Simple CRUD System<br />
        <span className="header-6">Developed by <a href="https://ronros96.github.io/portfolio/" target="_blank" rel="noopener">Aaron Rosales</a></span>
      </h1>
      <h3 className='header-4'>Greetings!</h3>
      <p>Thank you for taking the time to explore my Simple CRUD System!</p>
      <p>This project demonstrates the fundamentals of <strong>Create, Read, Update, and Delete (CRUD)</strong> operations using React as the primary framework, with a few extra features to make the experience more interactive.</p>
      <p>Powered by <a href="https://mockapi.io/" target="_blank" rel="noopener">MockAPI.io</a> as its REST API provider, this application lets you experiment with user management, from registering and updating accounts to deleting existing users, including the preloaded dummy accounts.</p>
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
            <FaReact size={20} />
            <a href="https://react.dev/" target="_blank" rel="noopener">React JS</a>
          </h5>
          Front-end framework for building the user interface.
          <Divider />
          Some Components Used:
          <ul className='grid grid-cols-3 max-w-[30rem] justify-center'>
            <li>
              <h6>
                <SiShadcnui size={20} />
                <a href="https://ui.shadcn.com/" target="_blank" rel="noopener">ShadCN</a>
              </h6>
              UI library
            </li>
            <li>
              <h6>
                <Motion/>
                <a href="https://motion.dev/" target="_blank" rel="noopener">Motion</a>
              </h6>
              UI Animation
            </li>
            <li>
              <h6>
                <RiTailwindCssFill size={20} />
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener">Tailwind</a>
              </h6>
              CSS Framework
            </li>
          </ul>
        </li>
        <li>
          <h6>
            <p className='pacifico-regular'>mockapi.io</p>
            <a href="https://mockapi.io/" target="_blank" rel="noopener">MockAPI.io</a>
          </h6>
          REST API service for storing and managing demo user records.
        </li>
      </ul>
      <h4 className='header-5'>Explore and Experiment!</h4>
      <p>Feel free to test the available features, explore the interface, and see how CRUD operations work in practice.</p>
      <p>You're also welcome to clone the repository, inspect the code, and build upon the project to suit your own needs.</p>
      <p>Thanks for checking out my work. Happy exploring!</p>
      <a href="https://github.com/ronros96/simple-crud" target="_blank" rel="noopener" className='git-button'>
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