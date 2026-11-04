import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I'm Rishabh's AI assistant. Ask me about his skills, projects, or experience."
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Automatically scroll to the latest chat message
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages]);

  // Send message and receive AI response as a stream
  const sendMessage = async (event) => {
    event.preventDefault();

    const message = chatInput.trim();

    if (!message || chatLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: 'user', text: message },
      { role: 'bot', text: '' }
    ]);

    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        }
      );

      if (!response.ok) {
        throw new Error('Unable to get a response. Please try again.');
      }

      if (!response.body) {
        throw new Error('Streaming is not supported by this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let receivedText = '';

      const updateBotMessage = (text) => {
        setMessages((previous) => {
          const updated = [...previous];
          const lastIndex = updated.length - 1;

          updated[lastIndex] = {
            ...updated[lastIndex],
            text
          };

          return updated;
        });
      };

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true
        });

        if (chunk) {
          receivedText += chunk;
          updateBotMessage(receivedText);
        }
      }

      const remainingText = decoder.decode();

      if (remainingText) {
        receivedText += remainingText;
        updateBotMessage(receivedText);
      }

      if (!receivedText.trim()) {
        throw new Error('The assistant returned an empty response.');
      }

    } catch (error) {
      console.error('Chat error:', error);

      setMessages((previous) => {
        const updated = [...previous];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          text: 'Sorry, something went wrong. Please try again.'
        };

        return updated;
      });

    } finally {
      setChatLoading(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <h2>Rishabh</h2>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#assistant" onClick={closeMenu}>AI Assistant</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>

        <a
          href="/Rishabh-Rana-CV.pdf"
          download="Rishabh-Rana-CV.pdf"
          className="download-btn"
        >
          Download CV
        </a>
      </nav>

      <main>

        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="hero-tag">WELCOME TO MY PORTFOLIO</p>

            <h1>
              Hello, I'm <span>Rishabh</span>
            </h1>

            <h2>Java Backend Developer</h2>

            <p className="hero-description">
              I build secure, scalable and efficient web applications
              using Java, Spring Boot, PostgreSQL and modern technologies.
              I enjoy solving problems and developing practical solutions.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="primary-btn">
                Explore My Work →
              </a>

              <a href="#contact" className="secondary-btn">
                Contact Me
              </a>
            </div>

            <div className="hero-social-links">
              <a
                href="https://github.com/rish-on-code"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/rishabh-rana-65982a253/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="code-window">
              <div className="code-header">
                <span></span><span></span><span></span>
              </div>

              <pre>
                <code>{`public class Developer {
  String name = "Rishabh";
  String role = "Java Backend Developer";

  public void build() {
    System.out.println("Building...");
  }
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="section-heading">
            <p>GET TO KNOW ME</p>
            <h2>About <span>Me</span></h2>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h3>Java Backend Developer</h3>

              <p>
                I'm a passionate Java Backend Developer focused on
                building secure, scalable and efficient web applications.
              </p>

              <p>
                I work with Java, Spring Boot, Spring Security,
                REST APIs and PostgreSQL. I enjoy solving problems
                and turning ideas into practical applications.
              </p>

              <p>
                Currently, I'm improving my development skills
                and building real-world projects.
              </p>
            </div>

            <div className="skills-card">
              <h3>Technical Skills</h3>

              <div className="skills-list">
                {[
                  'Java',
                  'Spring Boot',
                  'Spring Security',
                  'JWT Authentication',
                  'REST APIs',
                  'PostgreSQL',
                  'React.js',
                  'JavaScript',
                  'HTML & CSS',
                  'Git & GitHub'
                ].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects">
          <div className="section-heading">
            <p>MY RECENT WORK</p>
            <h2>Featured <span>Projects</span></h2>
          </div>

          <div className="projects-container">
            <div className="project-card">
              <div className="project-icon">💼</div>

              <h3>Job Application Tracker</h3>

              <p>
                A full-stack job application management platform
                with secure authentication, job management and
                application tracking features.
              </p>

              <div className="project-tech">
                <span>Java</span>
                <span>Spring Boot</span>
                <span>Spring Security</span>
                <span>JWT</span>
                <span>PostgreSQL</span>
                <span>React</span>
              </div>

              <div className="project-links">
                <a
                  href="https://github.com/rish-on-code/jobtracker-backend"
                  target="_blank"
                  rel="noreferrer"
                >
                  Backend GitHub ↗
                </a>

                <a
                  href="https://github.com/rish-on-code/jobtracker-frontend"
                  target="_blank"
                  rel="noreferrer"
                >
                  Frontend GitHub ↗
                </a>

                <a
                  href="https://jobtracker-frontend-bice.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo ↗
                </a>
              </div>
            </div>

            <div className="project-card">
              <div className="project-icon">🧠</div>

              <h3>Java Console Quiz App</h3>

              <p>
                A console-based quiz application built using
                Core Java and Object-Oriented Programming concepts.
              </p>

              <div className="project-tech">
                <span>Java</span>
                <span>OOP</span>
                <span>Collections</span>
                <span>Exception Handling</span>
              </div>

              <div className="project-links">
                <a
                  href="https://github.com/rish-on-code/quiz-console-app"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub Repository ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section id="assistant" className="assistant">
          <div className="section-heading">
            <p>LET'S TALK</p>
            <h2>Meet My <span>AI Assistant</span></h2>
          </div>

          <div className="chatbot-container">
            <div className="chatbot-header">
              <div className="bot-avatar">AI</div>

              <div>
                <h3>Rishabh's AI Assistant</h3>

                <p>
                  <span className="online-dot"></span>
                  {chatLoading ? 'Thinking...' : 'Online'}
                </p>
              </div>
            </div>

            <div className="chat-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === 'user'
                      ? 'user-message'
                      : 'bot-message'
                  }
                >
                  {message.role === 'bot' &&
!message.text &&
chatLoading ? (
  <div
    className="typing-indicator"
    role="status"
    aria-label="Assistant is typing"
  >
    <span></span>
    <span></span>
    <span></span>
  </div>
) : (
  <ReactMarkdown>{message.text}</ReactMarkdown>
)}
                </div>
              ))}

              <div ref={chatEndRef} />
            </div>

            <form className="chat-input" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Ask me about Rishabh's projects..."
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                disabled={chatLoading}
                aria-label="Message for AI assistant"
              />

              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
              >
                {chatLoading ? 'Sending...' : 'Send'}
              </button>
            </form>

            <p className="chat-note">
              AI-powered assistant • Responses in English
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="section-heading">
            <p>GET IN TOUCH</p>
            <h2>Let's Work <span>Together</span></h2>
          </div>

          <div className="contact-content">
            <h3>Have a Project in Mind?</h3>

            <p>
              I'm always open to discussing new projects,
              creative ideas and opportunities.
              Feel free to reach out!
            </p>

            <div className="social-links">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rishabhrana737@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>✉</span>
                <strong>Email Me</strong>
                <small>rishabhrana737@gmail.com</small>
              </a>

              <a
                href="https://www.linkedin.com/in/rishabh-rana-65982a253/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>in</span>
                <strong>LinkedIn</strong>
                <small>Connect with me</small>
              </a>

              <a
                href="https://github.com/rish-on-code"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>⌘</span>
                <strong>GitHub</strong>
                <small>Explore my projects</small>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h2>Rishabh<span>.</span></h2>

          <p>
            Java Backend Developer | Building Solutions Through Code
          </p>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-divider"></div>

          <p className="copyright">
            © 2026 Rishabh. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
