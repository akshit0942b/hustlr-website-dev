import styled from 'styled-components';

const CardContainer = styled.div`
  perspective: 1200px;
  width: 320px;
  height: 180px;
  margin: 1rem;
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(.4,2,.6,1);
  transform-style: preserve-3d;
  position: relative;
  &:hover {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #fff;
  color: #000;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 1.1rem;
  padding: 2rem;
`;

const CardBack = styled(CardFace)`
  background: #000;
  color: #fff;
  transform: rotateY(180deg);
`;

export default function FlipCard({ front, back }) {
  return (
    <CardContainer>
      <Card>
        <CardFace>{front}</CardFace>
        <CardBack>{back}</CardBack>
      </Card>
    </CardContainer>
  );
} 