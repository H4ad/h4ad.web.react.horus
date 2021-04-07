/* eslint-ignore */
import { Component } from 'react';

const animationName = 'react-github-calendar-loading';

function injectCSSAnimation() {
  const elem = document.createElement('style');
  document.head.appendChild(elem);

  const styleSheet = elem.sheet as CSSStyleSheet;

  const keyframes = `
    @keyframes ${animationName} {
      100% {
        transform: translateX(100%);
      }
    }
  `;

  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

function getWrapperStyles({ width, height, background }: any): any {
  return {
    position: 'relative',
    overflow: 'hidden',
    width: `${width}px`,
    height: '190px',
    borderRadius: '0.3em',
    background,
  };
}

function getLoadingStyles(): any {
  return {
    display: 'block',
    content: '',
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: 'translateX(-100%)',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, .4), transparent)',
    animation: `${animationName} 1.5s infinite`,
  };
}

class Skeleton extends Component {
  componentDidMount() {
    injectCSSAnimation();
  }

  render() {
    return (
      <div style={getWrapperStyles(this.props)}>
        <div style={getLoadingStyles()} />
      </div>
    );
  }
}

export default Skeleton;
