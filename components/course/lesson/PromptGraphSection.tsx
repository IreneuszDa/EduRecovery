import React from 'react';
import PromptGraphDemo from '@/components/ui/PromptGraphDemo';
import { motion } from 'framer-motion';

interface PromptGraphSectionProps {
  graphPrompt?: string;
  question?: string;
  options?: Array<{ id: string; text: string }>;
  onComplete?: () => void;
  initialInputs?: Record<string, string>;
}

const PromptGraphSection: React.FC<PromptGraphSectionProps> = ({
  graphPrompt = 'Draw a linear function y = 2x + 3 with range -5, 5',
  question = 'Eksploruj wykres opisując go słowami:',
  options = [],
  onComplete,
  initialInputs = {},
}) => {
  // Set default if not provided in initialInputs
  const initialPrompt = initialInputs.graphInput || graphPrompt;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle completion
  const handleCompletion = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div
      className="prompt-graph-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="prompt-graph-section-header" variants={itemVariants}>
        <h3>{question}</h3>
        {options.length > 0 && (
          <div className="prompt-graph-presets">
            <h4>Gotowe przykłady:</h4>
            <div className="prompt-graph-preset-buttons">
              {options.map(option => (
                <button
                  key={option.id}
                  className="prompt-graph-preset-button"
                  onClick={() => {
                    // This would be handled by actual implementation
                    console.log(`Selected preset: ${option.text}`);
                    // In real implementation, this would update the input value
                    setTimeout(handleCompletion, 1000); // Simulate completion
                  }}
                >
                  {option.text.length > 40 ? `${option.text.substring(0, 40)}...` : option.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div className="prompt-graph-demo-wrapper" variants={itemVariants}>
        <PromptGraphDemo
          initialPrompt={initialPrompt}
          className="prompt-graph-in-lesson"
        />
      </motion.div>

      <motion.div className="prompt-graph-completion" variants={itemVariants}>
        <button
          className="prompt-graph-continue-button"
          onClick={handleCompletion}
        >
          Kontynuuj lekcję
        </button>
      </motion.div>

      <style jsx>{`
        .prompt-graph-section {
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .prompt-graph-section-header h3 {
          margin-top: 0;
          color: #333;
          font-size: 1.2rem;
        }
        
        .prompt-graph-presets {
          margin: 15px 0;
        }
        
        .prompt-graph-presets h4 {
          font-size: 0.9rem;
          margin-bottom: 8px;
          color: #555;
        }
        
        .prompt-graph-preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .prompt-graph-preset-button {
          background-color: #e9ecef;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .prompt-graph-preset-button:hover {
          background-color: #dee2e6;
        }
        
        .prompt-graph-demo-wrapper {
          margin: 20px 0;
        }
        
        .prompt-graph-completion {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .prompt-graph-continue-button {
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .prompt-graph-continue-button:hover {
          background-color: #357abf;
        }

        .prompt-graph-in-lesson :global(.prompt-graph-info) {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PromptGraphSection;
