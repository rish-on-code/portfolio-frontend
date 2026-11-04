
import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from 'react';
import './index.css';

// CSS-based 3D cartoon developer
function DeveloperMascot() {
  return (
    <div className="developer-scene" aria-label="Cartoon developer working on a laptop">
      <div className="scene-orbit orbit-one"></div>
      <div className="scene-orbit orbit-two"></div>

      <div className="dev-spark spark-one">✦</div>
      <div className="dev-spark spark-two">✧</div>
      <div className="dev-spark spark-three">+</div>

      <div className="dev-floating-card dev-card-one">
        <span>☕</span>
        <div><strong>Code mode</strong><small>Always learning</small></div>
      </div>

      <div className="dev-floating-card dev-card-two">
        <span className="dev-check">✓</span>
        <div><strong>Problem solved</strong><small>Java developer</small></div>
      </div>

      <div className="developer">
        <div className="dev-hair"></div>
        <div className="dev-head">
          <div className="dev-ear dev-ear-left"></div>
          <div className="dev-ear dev-ear-right"></div>
          <div className="dev-face">
            <div className="dev-eyebrow eyebrow-left"></div>
            <div className="dev-eyebrow eyebrow-right"></div>
            <div className="dev-eye eye-left"></div>
            <div className="dev-eye eye-right"></div>
            <div className="dev-nose"></div>
            <div className="dev-smile"></div>
            <div className="dev-blush blush-left"></div>
            <div className="dev-blush blush-right"></div>
          </div>
        </div>

        <div className="dev-neck"></div>
        <div className="dev-body">
          <div className="dev-shirt-mark">R</div>
          <div className="dev-arm arm-left"></div>
          <div className="dev-arm arm-right"></div>
        </div>

        <div className="dev-laptop">
          <div className="laptop-screen">
            <div className="laptop-camera"></div>
            <div className="laptop-code">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span>
            </div>
            <div className="laptop-screen-glow"></div>
          </div>
          <div className="laptop-base"></div>
        </div>
      </div>

      <div className="dev-platform"></div>
      <div className="scene-caption">Building something awesome <span>🚀</span></div>
    </div>
  );
}

// CSS-based animated AI robot
function RobotMascot() {
  return (
    <div className="robot-scene" aria-label="Cute animated AI robot">
      <div className="robot-halo"></div>
      <div className="robot-star star-one">✦</div>
      <div className="robot-star star-two">✧</div>
      <div className="robot-star star-three">+</div>

      <div className="robot">
        <div className="robot-antenna">
          <span></span>
        </div>

        <div className="robot-ear robot-ear-left"></div>
        <div className="robot-ear robot-ear-right"></div>

        <div className="robot-head">
          <div className="robot-face">
            <div className="robot-eye robot-eye-left"></div>
            <div className="robot-eye robot-eye-right"></div>
            <div className="robot-mouth"></div>
            <div className="robot-cheek robot-cheek-left"></div>
            <div className="robot-cheek robot-cheek-right"></div>
          </div>
          <div className="robot-head-shine"></div>
        </div>

        <div className="robot-neck"></div>
        <div className="robot-body">
          <div className="robot-chest">
            <span>AI</span>
            <i></i>
          </div>
          <div className="robot-arm robot-arm-left"></div>
          <div className="robot-arm robot-arm-right"></div>
        </div>

        <div className="robot-leg robot-leg-left"></div>
        <div className="robot-leg robot-leg-right"></div>
      </div>

      <div className="robot-shadow"></div>
      <div className="robot-label">Your friendly AI assistant</div>
    </div>
  );
}

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

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages]);

  // Scroll reveal and active navbar link
  useEffect(() => {
    const elements = document.querySelectorAll(
      'main section:not(#home), .info-card, .project-card, .chatbot-container, .contact-content'
    );

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => {
      element.classList.add('reveal-on-scroll');
      revealObserver.observe(element);
    });

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active-link',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px' });

    sections.forEach((section) => activeObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  // Existing Gemini streaming chatbot logic
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
          headers: { 'Content-Type': 'application/json' },
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

        const chunk = decoder.decode(value, { stream: true });

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
        {/* HOME */}
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="availability">
              <span className="online-dot"></span>
              Available for opportunities
            </div>

            <p className="hero-tag">WELCOME TO MY LITTLE CORNER</p>

            <h1>
              Hey, I'm <span>Rishabh!</span>
              <br />
              I build things
              <br />
              with <span className="highlight-text">code.</span>
            </h1>

            <h2>Java Backend Developer <span>👨‍💻</span></h2>

            <p className="hero-description">
              I build secure, scalable and efficient web applications
              using Java, Spring Boot, PostgreSQL and modern technologies.
              I enjoy solving problems and bringing ideas to life.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="primary-btn">
                Explore My Work <span>↗</span>
              </a>
              <a href="#contact" className="secondary-btn">
                Let's Talk
              </a>
            </div>

            <div className="hero-social-links">
              <a href="https://github.com/rish-on-code" target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/rishabh-rana-65982a253/" target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <DeveloperMascot />
          </div>

          <div className="hero-bottom-note">
            <span></span> SCROLL TO EXPLORE <span>↓</span>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about section">
          <div className="section-heading">
            <p className="section-label">A LITTLE ABOUT ME</p>
            <h2>Behind the <span>Code</span></h2>
            <div className="heading-line"></div>
            <p className="section-subtitle">
              A curious developer who loves learning and building.
            </p>
          </div>

          <div className="about-content">
            <div className="about-text info-card">
              <div className="card-top-label">
                <span className="card-icon">01</span>
                <span>MY STORY</span>
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
                <span>MY SUPERPOWERS</span>
              </div>

              <h3>Technical Skills</h3>
              <p className="skills-description">
                Tools I use to turn ideas into applications.
              </p>

              <div className="skills-list">
                {[
                  'Java', 'Spring Boot', 'Spring Security',
                  'JWT Authentication', 'REST APIs', 'PostgreSQL',
                  'React.js', 'JavaScript', 'HTML & CSS', 'Git & GitHub'
                ].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="projects section">
          <div className="section-heading">
            <p className="section-label">THINGS I'VE BUILT</p>
            <h2>My <span>Projects</span></h2>
            <div className="heading-line"></div>
            <p className="section-subtitle">
              Some practical applications built with curiosity and code.
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
                <a href="https://github.com/rish-on-code/jobtracker-backend" target="_blank" rel="noreferrer">
                  Backend GitHub ↗
                </a>
                <a href="https://github.com/rish-on-code/jobtracker-frontend" target="_blank" rel="noreferrer">
                  Frontend GitHub ↗
                </a>
                <a href="https://jobtracker-frontend-bice.vercel.app" target="_blank" rel="noreferrer" className="live-link">
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
                <a href="https://github.com/rish-on-code/quiz-console-app" target="_blank" rel="noreferrer">
                  GitHub Repository ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AI ASSISTANT */}
        <section id="assistant" className="assistant section">
          <div className="section-heading">
            <p className="section-label">SAY HELLO TO MY ROBOT</p>
            <h2>Meet My <span>AI Buddy!</span></h2>
            <div className="heading-line"></div>
            <p className="section-subtitle">
              Curious about me? My little AI buddy has the answers.
            </p>
          </div>

          <div className="assistant-layout">
            <div className="robot-side">
              <RobotMascot />
              <div className="robot-side-text">
                <h3>Hi, I'm RishiBot! <span>🤖</span></h3>
                <p>Your friendly portfolio assistant. Ask me anything about Rishabh!</p>
                <div className="robot-status">
                  <span className="online-dot"></span>
                  Always ready to help
                </div>
              </div>
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
                <span className="ai-badge">GEMINI AI</span>
              </div>

              <div className="chat-messages" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={message.role === 'user' ? 'user-message' : 'bot-message'}
                  >
                    {message.role === 'bot' && !message.text && chatLoading ? (
                      <div className="typing-indicator" role="status" aria-label="Assistant is typing">
                        <span></span><span></span><span></span>
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
                <button type="submit" disabled={chatLoading || !chatInput.trim()}>
                  {chatLoading ? 'Sending...' : 'Send'} <span>↗</span>
                </button>
              </form>

              <p className="chat-note">
                Powered by Gemini AI • Responses in English
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact section">
          <div className="section-heading">
            <p className="section-label">LET'S CONNECT</p>
            <h2>Let's Make Something <span>Cool!</span></h2>
            <div className="heading-line"></div>
          </div>

          <div className="contact-content">
            <div className="contact-intro">
              <span className="contact-overline">HAVE AN IDEA?</span>
              <h3>Let's build something <span>great.</span></h3>
              <p>
                I'm open to discussing new projects, creative ideas
                and opportunities. Feel free to reach out!
              </p>
              <div className="contact-decoration">✦ ✧ ✦</div>
            </div>

            <div className="social-links">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rishabhrana737@gmail.com" target="_blank" rel="noopener noreferrer">
                <span className="social-icon">✉</span>
                <span className="social-info">
                  <strong>Email Me</strong>
                  <small>rishabhrana737@gmail.com</small>
                </span>
                <span className="social-arrow">↗</span>
              </a>

              <a href="https://www.linkedin.com/in/rishabh-rana-65982a253/" target="_blank" rel="noopener noreferrer">
                <span className="social-icon">in</span>
                <span className="social-info">
                  <strong>LinkedIn</strong>
                  <small>Connect with me</small>
                </span>
                <span className="social-arrow">↗</span>
              </a>

              <a href="https://github.com/rish-on-code" target="_blank" rel="noopener noreferrer">
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

      <footer className="footer">
        <div className="footer-content">
          <a href="#home" className="footer-logo">
            Rishabh<span>.</span>
          </a>
          <p>Java Backend Developer | Building Solutions Through Code</p>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-divider"></div>
          <p className="copyright">© 2026 Rishabh. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
