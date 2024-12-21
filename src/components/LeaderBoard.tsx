import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

//type for Participant
interface Participant {
  name: string;
  score: number;
  prevScore: number;
  position: number;
  prevPosition: number;
}

//type for Row Color
interface RowColor {
  bg: string;
  text: string;
}

interface LeaderboardProps {
  onParticipantsUpdate: (participants: Participant[]) => void;
}

// Initial mock data for leaderboard participants
const initialParticipants: Participant[] = [
  { name: 'Alice', score: 100, prevScore: 100, position: 0, prevPosition: 0 },
  { name: 'Bob', score: 100, prevScore: 100, position: 1, prevPosition: 1 },
  { name: 'Charlie', score: 100, prevScore: 100, position: 2, prevPosition: 2 },
  { name: 'David', score: 100, prevScore: 100, position: 3, prevPosition: 3 },
  { name: 'Eve', score: 100, prevScore: 100, position: 4, prevPosition: 4 },
  { name: 'Efe', score: 100, prevScore: 100, position: 5, prevPosition: 5 },
  { name: 'Mike', score: 100, prevScore: 100, position: 6, prevPosition: 6 },
  { name: 'Ashoka', score: 100, prevScore: 100, position: 7, prevPosition: 7 },
  { name: 'Ahmad', score: 100, prevScore: 100, position: 8, prevPosition: 8 },
  { name: 'Tolu', score: 100, prevScore: 100, position: 9, prevPosition: 9 },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ onParticipantsUpdate }) => {
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to generate random score updates
  const updateScores = (): void => {
    setParticipants((prevParticipants) => {
      const updatedParticipants = prevParticipants.map((participant) => {
        const scoreDelta = Math.floor(Math.random() * 11) - 5; // Random number between -5 and 5
        return {
          ...participant,
          prevScore: participant.score,
          score: Math.max(0, participant.score + scoreDelta),
        };
      });

      // Sort participants by score in descending order and update positions
      const sortedParticipants = updatedParticipants
        .sort((a, b) => b.score - a.score)
        .map((participant, index) => ({
          ...participant,
          prevPosition: participant.position,
          position: index,
        }));

      setLastUpdated(new Date());
      return sortedParticipants;
    });
  };

  useEffect(() => {
    onParticipantsUpdate(participants);
  }, [participants, onParticipantsUpdate]);

  // Set up periodic updates every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(updateScores, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to get row color based on position
  const getRowColor = (index: number): RowColor => {
    if (index === 0) return { bg: 'bg-green-50', text: 'text-green-800' };
    if (index >= 1 && index <= 4)
      return { bg: 'bg-yellow-50', text: 'text-yellow-800' };
    if (index >= 8) return { bg: 'bg-red-50', text: 'text-red-800' };
    return { bg: 'bg-blue-50', text: 'text-blue-800' };
  };

  // Function to get tooltip text based on position
  const getTooltipText = (index: number): string => {
    if (index === 0) return 'Board Leader ';
    if (index >= 1 && index <= 4) return 'Playoffs';
    if (index >= 8) return 'Relegation';
    return 'Mid-table';
  };

  // Function to get badge color based on position
  const getBadgeColor = (index: number): string => {
    if (index === 0) return 'bg-green-100 text-green-800';
    if (index >= 1 && index <= 4) return 'bg-yellow-100 text-yellow-800';
    if (index >= 8) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  // Function to render position change icon
  const renderPositionChangeIcon = (participant: Participant) => {
    if (participant.position === 0) {
      return <Trophy className='text-yellow-500 w-6 h-6' />;
    }

    if (participant.position < participant.prevPosition) {
      return <ChevronUp className='text-green-500' />;
    } else if (participant.position > participant.prevPosition) {
      return <ChevronDown className='text-red-500' />;
    }

    return <Minus className='text-gray-500' />;
  };

  // Function to render score delta text
  const renderScoreDeltaText = (participant: Participant) => {
    const scoreDelta = participant.score - participant.prevScore;
    if (scoreDelta === 0) return null;

    const sign = scoreDelta > 0 ? '+' : '';
    const color = scoreDelta > 0 ? 'text-green-600' : 'text-red-600';

    return (
      <span className={`text-xs ml-1 ${color}`}>
        {sign}
        {scoreDelta}
      </span>
    );
  };

  return (
    <div className='max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden'>
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <Trophy className='text-white w-8 h-8' />
          <h2 className='text-white text-2xl font-bold'>Leaderboard</h2>
        </div>
        <span className='text-white text-sm'>
          Last Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      <motion.div className='divide-y divide-gray-200'>
        <AnimatePresence>
          {participants.map((participant, index) => {
            const rowColor = getRowColor(index);
            const tooltipContent = getTooltipText(index);
            const badgeId = `badge-${participant.name}`;

            return (
              <motion.div
                key={participant.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: 0.5,
                }}
                className={`p-4 flex items-center justify-between ${rowColor.bg} ${rowColor.text}`}
              >
                <div className='flex items-center space-x-4'>
                  <motion.div
                    id={badgeId}
                    data-tooltip-content={tooltipContent}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      font-bold ${getBadgeColor(index)}
                    `}
                  >
                    {index + 1}
                  </motion.div>
                  <span className='font-semibold text-gray-800'>
                    {participant.name}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='flex items-center'>
                    <motion.span
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className='font-bold text-lg text-gray-900'
                    >
                      {participant.score}
                    </motion.span>
                    {renderScoreDeltaText(participant)}
                  </div>
                  {renderPositionChangeIcon(participant)}
                </div>
                <Tooltip anchorId={badgeId} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Leaderboard;