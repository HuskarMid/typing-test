import React from 'react';
import './App.scss';
import styled, { css, keyframes } from 'styled-components';
import { useState, useEffect, useCallback } from 'react';

interface StyledProps {
  $isSolved: boolean;
}

const TextP = styled.p<StyledProps>`
  color: ${props => props.$isSolved ? '#8B42D6' : '#FFEF00'};
  border-bottom: ${props => props.$iscurrent ? '3px solid #8B42D6' : 'none'};
  font-size: 45px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  background: none;
`;

const FadeInAnimation = keyframes`
  0% {background-color: transparent; transform: scale(1);}
  50% {
    background-color: rgba(139, 66, 214, 0.3); 
    border-color: rgba(159, 105, 214, 0.8);
    transform: scale(0.95);
  }
  100% {background-color: transparent; transform: scale(1);}
`;

const Key = styled.div<{ $used?: boolean }>`
  width: 85px;
  height: 85px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }

  animation: ${props => props.$used ? css`${FadeInAnimation} 0.2s ease` : 'none'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
`;

const SettingsButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  height: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  h2 {
    width: 100%;
    font-size: 40px;
    margin-bottom: 20px;
    background: none;
    text-align: center;
  }
`;

const TextInput = styled.textarea`
  width: 90%;
  height: 100px;
  padding: 10px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  font-size: 20px;
`;

const SubmitButton = styled.button`
  width: 50%;
  height: 50px;
  background: #8B42D6;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #9F69D6;
  }
`;

function App() {

  //Текст и шаги в тексте

  const [step, setStep] = useState(0)

  const [defaultText, setDefaultText] = useState('Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua')

  const [text, setText] = useState(() => {
    const textArray = defaultText.split('')
    return textArray.map((char, i) => ({
      id: i,
      value: char === ' ' ? '\u00A0' : char,
      iscurrent: i === 0,
      isSolved: false
    }))
  })

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText] = useState(defaultText);

  const changeDefaultText = (newText: string) => {
    setDefaultText(newText);
    setStep(0);
    setText(newText.split('').map((char, i) => ({
      id: i,
      value: char === ' ' ? '\u00A0' : char,
      iscurrent: i === 0,
      isSolved: false
    })));
  };

  const [currentSymbol, setCurrentSymbol] = useState<string>(text[0]?.value || '')

  useEffect(() => {
    if (step < text.length) {
      setCurrentSymbol(text[step].value);
    }
  }, [step, text]);

  const isSymbol = useCallback((symbol) => {
    if (text.length > 0 && step < text.length) {
      if (symbol.toUpperCase() === currentSymbol.toUpperCase() || 
          (symbol === ' ' && currentSymbol === '\u00A0')) {
        
        setText(prevText => {
          const newState = [...prevText];
          newState[step] = {
            ...newState[step],
            isSolved: true,
            iscurrent: false
          };
          if (step + 1 < text.length) {
            newState[step + 1] = {
              ...newState[step + 1],
              iscurrent: true
            };
          }
          setStep(step + 1);
          return newState;
        });
      } else {
        console.log('Неправильно');
      }
    }
  }, [text, step, currentSymbol]);

  //КНОПКИ

  const createKeyboardLayout = () => [
    {id: 1, value: 'Q'}, {id: 2, value: 'W'}, {id: 3, value: 'E'}, {id: 4, value: 'R'},
    {id: 5, value: 'T'}, {id: 6, value: 'Y'}, {id: 7, value: 'U'}, {id: 8, value: 'I'},
    {id: 9, value: 'O'}, {id: 10, value: 'P'}, {id: 11, value: ['{', '[']}, {id: 12, value: ['}', ']']},
    {id: 13, value: 'A'}, {id: 14, value: 'S'}, {id: 15, value: 'D'}, {id: 16, value: 'F'},
    {id: 17, value: 'G'}, {id: 18, value: 'H'}, {id: 19, value: 'J'}, {id: 20, value: 'K'},
    {id: 21, value: 'L'}, {id: 22, value: [':', ';']}, {id: 23, value: ['"', "'"]},
    {id: 24, value: 'Z'}, {id: 25, value: 'X'}, {id: 26, value: 'C'}, {id: 27, value: 'V'},
    {id: 28, value: 'B'}, {id: 29, value: 'N'}, {id: 30, value: 'M'},
    {id: 31, value: [',', '<']}, {id: 32, value: ['.', '>']}, {id: 33, value: ['/', '?']},
    {id: 34, value: ''}
  ].map(key => ({ ...key, used: false }));

  const [keys, setKeys] = useState(createKeyboardLayout());

  //Слушатель нажатий

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const keyMap: { [key: string]: number } = {
      'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5, 'u': 6, 'i': 7, 'o': 8, 'p': 9,
      '{': 10, '[': 10, '}': 11, ']': 11,
      'a': 12, 's': 13, 'd': 14, 'f': 15, 'g': 16, 'h': 17, 'j': 18, 'k': 19, 'l': 20,
      ':': 21, ';': 21, '"': 22, "'": 22,
      'z': 23, 'x': 24, 'c': 25, 'v': 26, 'b': 27, 'n': 28, 'm': 29,
      ',': 30, '<': 30, '.': 31, '>': 31, '/': 32, '?': 32,
      ' ': 33
    };

    const keyIndex = keyMap[event.key.toLowerCase()];
    if (keyIndex !== undefined) {
      requestAnimationFrame(() => {
        setKeys(prevKeys => {
          const newKeys = [...prevKeys];
          newKeys[keyIndex] = { ...newKeys[keyIndex], used: true };
          
          requestAnimationFrame(() => {
            setTimeout(() => {
              setKeys(prevKeys => {
                const newKeys = [...prevKeys];
                newKeys[keyIndex] = { ...newKeys[keyIndex], used: false };
                return newKeys;
              });
            }, 100);
          });
          
          return newKeys;
        });
      });

      isSymbol(event.key);
    }
  }, [isSymbol]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const progress = (step / text.length) * 100;

  const handleSubmit = () => {
    changeDefaultText(newText);
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <SettingsButton onClick={() => setIsModalOpen(true)}>
        Настройки
      </SettingsButton>
      <Modal $isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Your text</h2>
          <TextInput 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Введите новый текст"
          />
          <SubmitButton onClick={handleSubmit}>
            Применить
          </SubmitButton>
        </ModalContent>
      </Modal>

      <div className="progress-bar">
        <ProgressBar className="progress-bar-fill" $progress={progress} />
      </div>
      <div className="textArea">
        {text.map((char) => <TextP key={char.id} $iscurrent={char.iscurrent} $isSolved={char.isSolved}>{char.value}</TextP>)}
      </div>
      <div className="keyboard">
        <div className="keyboard-row">
          {keys.slice(0, 12).map((key) => (
            <Key $used={key.used} key={key.id}>
              {Array.isArray(key.value) ? (
                <>
                  <p className="key-value">{key.value[0]}</p>
                  <p className="key-value">{key.value[1]}</p>
                </>
              ) : <p className="key-value">{key.value}</p>}
            </Key>
          ))}
        </div>
        <div className="keyboard-row">
          {keys.slice(12, 23).map((key) => (
            <Key $used={key.used} key={key.id}>
              {Array.isArray(key.value) ? (
                <>
                  <p className="key-value">{key.value[0]}</p>
                  <p className="key-value">{key.value[1]}</p>
                </>
              ) : <p className="key-value">{key.value}</p>}
            </Key>
          ))}
        </div>
        <div className="keyboard-row">
        {keys.slice(23, 33).map((key) => (
            <Key $used={key.used} key={key.id}>
              {Array.isArray(key.value) ? (
                <>
                  <p className="key-value">{key.value[0]}</p>
                  <p className="key-value">{key.value[1]}</p>
                </>
              ) : <p className="key-value">{key.value}</p>}
            </Key>
          ))}
        </div>
        <div className="keyboard-row">
          <Key className="space-key" $used={keys[33].used} key={keys[33].id}></Key>
        </div>
      </div>
    </div>
  );
}

export default App;