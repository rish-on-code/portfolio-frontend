
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

  const chatEndRef = useRef(null);

  // Automatically scroll to the latest chat message
  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages]);

  // Reveal sections smoothly while scrolling
  useEffect(() => {
    const elements = document.querySelectorAll(
      'main section'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    elements.forEach((element) => {
      element.classList.add('reveal-on-scroll');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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
      {/* Navbar */}
      <nav className="navbar">
        <a href="#home" className="logo" onClick={closeMenu}>
          Rishabh<span>.</span>
        </a>

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
          Download CV <span>↓</span>
        </a>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="availability">
              <span className="online-dot"></span>
              Available for opportunities
            </div>

            <p className="hero-tag">WELCOME TO MY PORTFOLIO</p>

            <h1>
              Building Digital
              <br />
              Solutions with <span>Code.</span>
            </h1>

            <h2>
              I'm <span>Rishabh</span> — Java Backend Developer
            </h2>

            <p className="hero-description">
              I build secure, scalable and efficient web applications
              using Java, Spring Boot, PostgreSQL and modern technologies.
              I enjoy solving problems and developing practical solutions.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="primary-btn">
                Explore My Work <span>↗</span>
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
            <div className="visual-glow"></div>

            <div className="code-window">
              <div className="code-header">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <p>Developer.java</p>
                <span className="code-status">● Java</span>
              </div>

              <div className="code-body">
                <div className="code-line">
                  <span className="line-number">01</span>
                  <span><span className="code-purple">public class</span> <span className="code-yellow">Developer</span> {'{'}</span>
                </div>

                <div className="code-line">
                  <span className="line-number">02</span>
                  <span className="code-indent"><span className="code-purple">String</span> name = <span className="code-green">"Rishabh"</span>;</span>
                </div>

                <div className="code-line">
                  <span className="line-number">03</span>
                  <span className="code-indent"><span className="code-purple">String</span> role = <span className="code-green">"Backend Developer"</span>;</span>
                </div>

                <div className="code-line">
                  <span className="line-number">04</span>
                  <span></span>
                </div>

                <div className="code-line">
                  <span className="line-number">05</span>
                  <span className="code-indent"><span className="code-purple">public void</span> <span className="code-blue">buildSolutions</span>() {'{'}</span>
                </div>

                <div className="code-line">
                  <span className="line-number">06</span>
                  <span className="code-indent-2">learn();</span>
                </div>

                <div className="code-line">
                  <span className="line-number">07</span>
                  <span className="code-indent-2">develop();</span>
                </div>

                <div className="code-line">
                  <span className="line-number">08</span>
                  <span className="code-indent-2">solveProblems();</span>
                </div>

                <div className="code-line">
                  <span className="line-number">09</span>
                  <span className="code-indent">{'}'}</span>
                </div>

                <div className="code-line">
                  <span className="line-number">10</span>
                  <span>{'}'}</span>
                </div>

                <div className="terminal-line">
                  <span className="terminal-symbol">❯</span>
                  <span>Building something meaningful...</span>
                  <span className="terminal-cursor"></span>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon">⌘</span>
              <div>
                <strong>Clean Code</strong>
                <small>Built with purpose</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-icon">⚡</span>
              <div>
                <strong>Backend Development</strong>
                <small>Java • Spring Boot</small>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="section-heading">
            <p className="section-label">GET TO KNOW ME</p>
            <h2>About <span>Me</span></h2>
            <div className="heading-line"></div>
          </div>

          <div className="about-content">
            <div className="about-text info-card">
              <div className="card-top-label">
                <span className="card-icon">01</span>
                <span>WHO I AM</span>
              </div>

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

              <div className="about-highlight">
                <span>✦</span>
                Focused on learning, building and growing.
              </div>
            </div>

            <div className="skills-card info-card">
              <div className="card-top-label">
                <span className="card-icon">02</span>
                <span>MY TOOLKIT</span>
              </div>

              <h3>Technical Skills</h3>

              <p className="skills-description">
                Technologies and tools I use to build applications.
              </p>

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
        <section id="projects" className="projects section">
          <div className="section-heading">
            <p className="section-label">MY RECENT WORK</p>
            <h2>Featured <span>Projects</span></h2>
            <div className="heading-line"></div>
            <p className="section-subtitle">
              A selection of projects where I turn ideas into working applications.
            </p>
          </div>

          <div className="projects-container">
            <div className="project-card">
              <div className="project-top">
                <div className="project-icon">💼</div>
                <span className="project-number">01 / 02</span>
              </div>

              <div className="project-category">FULL STACK APPLICATION</div>

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
                  className="live-link"
                >
                  Live Demo ↗
                </a>
              </div>
            </div>

            <div className="project-card">
              <div className="project-top">
                <div className="project-icon">🧠</div>
                <span className="project-number">02 / 02</span>
              </div>

              <div className="project-category">CORE JAVA APPLICATION</div>

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
        <section id="assistant" className="assistant section">
          <div className="section-heading">
            <p className="section-label">INTERACTIVE EXPERIENCE</p>
            <h2>Meet My <span>AI Assistant</span></h2>
            <div className="heading-line"></div>
            <p className="section-subtitle">
              Have a question? Start a conversation with my AI assistant.
            </p>
          </div>

          <div className="chatbot-container">
            <div className="chatbot-header">
              <div className="bot-avatar">AI</div>

              <div className="bot-details">
                <h3>Rishabh's AI Assistant</h3>

                <p>
                  <span className="online-dot"></span>
                  {chatLoading ? 'Thinking...' : 'Online and ready to help'}
                </p>
              </div>

              <span className="ai-badge">AI POWERED</span>
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
                {chatLoading ? 'Sending...' : 'Send'} <span>↗</span>
              </button>
            </form>

            <p className="chat-note">
              AI-powered assistant • Responses in English
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="section-heading">
            <p className="section-label">GET IN TOUCH</p>
            <h2>Let's Work <span>Together</span></h2>
            <div className="heading-line"></div>
          </div>

          <div className="contact-content">
            <div className="contact-intro">
              <span className="contact-overline">HAVE AN IDEA?</span>

              <h3>Let's build something <span>great.</span></h3>

              <p>
                I'm always open to discussing new projects,
                creative ideas and opportunities.
                Feel free to reach out!
              </p>
            </div>

            <div className="social-links">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rishabhrana737@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon">✉</span>
                <span className="social-info">
                  <strong>Email Me</strong>
                  <small>rishabhrana737@gmail.com</small>
                </span>
                <span className="social-arrow">↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/rishabh-rana-65982a253/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon">in</span>
                <span className="social-info">
                  <strong>LinkedIn</strong>
                  <small>Connect with me</small>
                </span>
                <span className="social-arrow">↗</span>
              </a>

              <a
                href="https://github.com/rish-on-code"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon">⌘</span>
                <span className="social-info">
                  <strong>GitHub</strong>
                  <small>Explore my projects</small>
                </span>
                <span className="social-arrow">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <a href="#home" className="footer-logo">
            Rishabh<span>.</span>
          </a>

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
