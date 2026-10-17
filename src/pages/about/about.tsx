const About = () =>{
  return(
    <section className='container header-margin'>
      <title>{`${import.meta.env.VITE_APP_TITLE} | About`}</title>
      <h1 className='header-3'>
        Simple CRUD System<br/>
        <span className="header-6">Developed by <a href="https://ronros96.github.io/portfolio/" target="_blank" rel="noopener">Aaron Rosales</a></span>
      </h1>
      <br/>
      <h4 className='header-5'>Greetings!</h4>
      <p>Thank you for taking the time to explore my Simple CRUD System!</p>
      <p>This project demonstrates the fundamentals of Create, Read, Update, and Delete (CRUD) operations using React as the primary framework, with a few extra features to make the experience more interactive.</p>
      <p>Powered by <a href="https://mockapi.io/" target="_blank" rel="noopener">MockAPI.io</a> as its REST API provider, this application lets you experiment with user management, from registering and updating accounts to deleting existing users, including the preloaded dummy accounts.</p>
      <h3 className='header-5'>Features</h3>
      <ul>
        <li>Create Accounts — Register new accounts and add them to the system.</li>
        <li>View and Search Users — Browse user records and find specific accounts using the available search filters.</li>
        <li>Update Accounts — Edit existing user information.</li>
        <li>Delete Accounts — Remove individual accounts or delete multiple selected accounts in bulk.</li>
        <li>Restore Dummy Data — Restore the original dummy accounts when the dataset has been emptied. Please note that this feature does not recover accounts you created yourself.</li>
        <li>Full Responsive — Mobile first approach</li>
        <li>Dual Theme Mode — Integrated with Light / Dark mode</li>
        <li>Fully Responsive Design — Built with a mobile-first approach to provide a consistent and user-friendly experience across mobile phones, tablets, laptops, and desktop screens.</li>
        <li>Dual Theme Mode — Switch between Light and Dark modes for a more comfortable and personalized browsing experience.</li>
      </ul>
      <h3 className='header-5'>Limitations and Considerations</h3>
      <p>This project uses a free, web-based REST API service for demonstration purposes. Please keep the following limitations in mind:</p>
      <ul>
        <li>Limited to 100 Accounts — The application is designed to work with a maximum of 100 accounts, keeping the dataset manageable for testing and demonstration.</li>
        <li>Bulk Deletion Limit — Bulk deletion is limited to 15 accounts per operation to help manage API requests and avoid unnecessary traffic.</li>
        <li>Basic Security — This is a demonstration project, not a production-ready user management system. Advanced security features, such as two-factor authentication (2FA), are not implemented. Avoid using real personal information or passwords.</li>
        <li>Demo Data Only — The application is intended for experimentation and showcasing CRUD functionality, rather than storing sensitive or critical user data.</li>
      </ul>
      <h3 className='header-5'>Technologies Used</h3>
      <ul>
        <li><a href="https://react.dev/" target="_blank" rel="noopener">React</a> — Front-end framework for building the user interface.</li>
        <ul>
          <li><a href="https://ui.shadcn.com/" target="_blank" rel="noopener">ShadCN</a> — UI library</li>
          <li><a href="https://motion.dev/" target="_blank" rel="noopener">Motion</a> — UI Animation</li>
          <li><a href="https://tailwindcss.com/" target="_blank" rel="noopener">Tailwind</a> — CSS Framework</li>
        </ul>
        <li><a href="https://mockapi.io/" target="_blank" rel="noopener">MockAPI.io</a> — REST API service for storing and managing demo user records.</li>
      </ul>
      <h3 className='header-5'>Explore and Experiment!</h3>
      <p>Feel free to test the available features, explore the interface, and see how CRUD operations work in practice.</p>
      <p>You're also welcome to clone the repository, inspect the code, and build upon the project to suit your own needs.</p>
      <p>Thanks for checking out my work. Happy exploring!</p>
      <a href="https://github.com/ronros96/simple-crud" target="_blank" rel="noopener">Git</a>
    </section>
  )
}
export default About