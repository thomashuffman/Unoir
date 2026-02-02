import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      runtimeErrors: []
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  componentDidMount() {
    // Catch runtime errors
    window.addEventListener('error', this.handleRuntimeError);
    // Catch promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleRuntimeError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  handleRuntimeError = (event) => {
    this.setState(prevState => ({
      runtimeErrors: [
        ...prevState.runtimeErrors,
        {
          type: 'Runtime Error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  handlePromiseRejection = (event) => {
    this.setState(prevState => ({
      runtimeErrors: [
        ...prevState.runtimeErrors,
        {
          type: 'Promise Rejection',
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  clearErrors = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      runtimeErrors: []
    });
  };

  render() {
    const { hasError, error, errorInfo, runtimeErrors } = this.state;

    if (hasError || runtimeErrors.length > 0) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1a0000',
          color: '#ff6b6b',
          padding: '20px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ color: '#ff3333', fontSize: '24px', marginBottom: '10px' }}>
              ⚠️ Application Error
            </h1>
            <button 
              onClick={this.clearErrors}
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '20px'
              }}
            >
              Try to Continue
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                marginLeft: '10px',
                marginBottom: '20px'
              }}
            >
              Reload App
            </button>
          </div>

          {hasError && error && (
            <div style={{ 
              backgroundColor: '#2d0000', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '20px',
              border: '2px solid #ff3333'
            }}>
              <h2 style={{ color: '#ff6b6b', fontSize: '18px', marginBottom: '10px' }}>
                Component Error:
              </h2>
              <div style={{ 
                backgroundColor: '#1a0000', 
                padding: '10px', 
                borderRadius: '3px',
                marginBottom: '10px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                <strong>Error:</strong> {error.toString()}
              </div>
              {errorInfo && errorInfo.componentStack && (
                <details style={{ marginTop: '10px' }}>
                  <summary style={{ cursor: 'pointer', color: '#ff9999' }}>
                    Component Stack
                  </summary>
                  <pre style={{ 
                    backgroundColor: '#1a0000', 
                    padding: '10px', 
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'auto',
                    fontSize: '11px'
                  }}>
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
              {error.stack && (
                <details style={{ marginTop: '10px' }}>
                  <summary style={{ cursor: 'pointer', color: '#ff9999' }}>
                    Error Stack
                  </summary>
                  <pre style={{ 
                    backgroundColor: '#1a0000', 
                    padding: '10px', 
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'auto',
                    fontSize: '11px'
                  }}>
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {runtimeErrors.length > 0 && (
            <div>
              <h2 style={{ color: '#ff6b6b', fontSize: '18px', marginBottom: '10px' }}>
                Runtime Errors ({runtimeErrors.length}):
              </h2>
              {runtimeErrors.map((err, index) => (
                <div 
                  key={index}
                  style={{ 
                    backgroundColor: '#2d0000', 
                    padding: '15px', 
                    borderRadius: '5px',
                    marginBottom: '10px',
                    border: '1px solid #ff6b6b'
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>
                    <strong style={{ color: '#ff9999' }}>{err.type}</strong>
                    <span style={{ color: '#999', marginLeft: '10px', fontSize: '10px' }}>
                      {err.timestamp}
                    </span>
                  </div>
                  <div style={{ 
                    backgroundColor: '#1a0000', 
                    padding: '10px', 
                    borderRadius: '3px',
                    marginTop: '5px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {err.message}
                  </div>
                  {err.filename && (
                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#999' }}>
                      File: {err.filename}:{err.lineno}:{err.colno}
                    </div>
                  )}
                  {err.stack && (
                    <details style={{ marginTop: '10px' }}>
                      <summary style={{ cursor: 'pointer', color: '#ff9999', fontSize: '11px' }}>
                        Stack Trace
                      </summary>
                      <pre style={{ 
                        backgroundColor: '#1a0000', 
                        padding: '10px', 
                        borderRadius: '3px',
                        marginTop: '5px',
                        overflow: 'auto',
                        fontSize: '10px'
                      }}>
                        {err.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;