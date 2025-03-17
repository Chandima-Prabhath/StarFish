interface FirstTimeSetupProps {
  whenDone: () => void;
}

import './FirstTimeSetup.css';

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ whenDone }) =>{
  // Setup the first time
  function Done(): void {
    const username = document.getElementById('username') as HTMLInputElement;
    console.log(username.value);
    if (username.value === '') {
      alert('Please enter a username');
      return;
    }
    // Save the username to local storage
    localStorage.setItem('username', username.value);
    // set setup to true
    localStorage.setItem('setup', 'true');
    whenDone();
  }
  return (
    <div className='first-time-setup fade-in'>
      <h1>First-time Setup</h1>
      <p>
        Before you can start using the app, you need to set up your account.
      </p>
      <p>
        <input type="text" name="username" id="username" placeholder="Your Name" />
      </p>
      <button type="button" onClick={Done}>Continue</button>
    </div>
  );
}

export default FirstTimeSetup;