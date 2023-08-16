'use client';

import './background.css';

export function Background() {
  return (
    <div className="well-container">
      <div className="well">
        <div className="wall" style={{transform: "rotateY(0deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(30deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(60deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(90deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(120deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(150deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(180deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(210deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(240deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(270deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(300deg) translateY(0px) translateZ(150px)"}}></div>
        <div className="wall" style={{transform: "rotateY(330deg) translateY(0px) translateZ(150px)"}}></div>
      </div>
      <div className="coin" style={{transform: "rotateY(0deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(36deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(72deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(108deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(144deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(180deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(216deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(252deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(288deg) translateY(-150px) translateZ(150px)"}}>B</div>
      <div className="coin" style={{transform: "rotateY(324deg) translateY(-150px) translateZ(150px)"}}>B</div>
    </div>
  );
}
