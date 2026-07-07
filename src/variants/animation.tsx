const bounce = [0.97, -0.41, 0.29, 1.37] as const;
// const simpleEase = [0.81, 0.14, 0.53, 0.74] as const;

export const popUpVar = {
  init:{
    opacity:0,
    top:'3rem',
    left:'1rem',
    rotate:45,
  },
  pop:{
    opacity:1,
    top:'-3rem',
    left:'0',
    rotate:0,
    
  },
}

export const transition = {
  duration:0.5,
  delay:0.1,
  ease: bounce,
}