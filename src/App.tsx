import React, { useState, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import Leaderboard from './components/LeaderBoard';

//types for better type safety
interface PerformanceStats {
  highestScore: number;
  lowestScore: number;
  medianScore: number;
  scoreRange: number;
}

interface RecentUpdate {
  type: 'position' | 'score';
  player: string;
  details: string;
  time: string;
}

interface Participant {
  name: string;
  score: number;
  prevScore: number;
  position: number;
  prevPosition: number;
}

const App: React.FC = () => {

  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    highestScore: 100,
    lowestScore: 59,
    medianScore: 85,
    scoreRange: 41,
  });

  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);

  // Memoized update stats function to prevent unnecessary re-renders
  const updateStats = useCallback((participants: Participant[]) => {



    // Update Performance Insights
    const scores = participants.map((p) => p.score);
    setPerformanceStats({
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      medianScore: Math.floor(
        scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
      ),
      scoreRange: Math.max(...scores) - Math.min(...scores),
    });

    // Update Recent Updates
    const newUpdates: RecentUpdate[] = [];
    const topPerformer = participants[0];
    const bottomPerformer = participants[participants.length - 1];

    if (topPerformer && topPerformer.position < topPerformer.prevPosition) {
      newUpdates.push({
        type: 'position',
        player: topPerformer.name,
        details: 'moved up to pole position',
        time: 'Just now',
      });
    }

    if (
      bottomPerformer &&
      bottomPerformer.position > bottomPerformer.prevPosition
    ) {
      newUpdates.push({
        type: 'position',
        player: bottomPerformer.name,
        details: 'dropped to last position',
        time: 'Just now',
      });
    }

    setRecentUpdates((prev) => [...newUpdates, ...prev].slice(0, 2));
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='container mx-auto'>
        {/* Header */}
        <header className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800 flex items-center'>
                <Trophy className='mr-3 text-yellow-500' />
                Competition Dashboard
              </h1>
              <p className='text-gray-600 mt-2'>
                Real-time performance tracking and leaderboard
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'>
                Export Stats
              </button>
              <button className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition'>
                Refresh Data
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className='grid grid-cols-3 gap-6'>
          {/* Leaderboard Section */}
          <div className='col-span-2'>
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='p-4 bg-gray-100 border-b'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Current Leaderboard
                </h2>
              </div>
              <Leaderboard onParticipantsUpdate={updateStats} />
            </div>
          </div>

          {/* Additional Information Sidebar */}
          <div className='space-y-6'>
            {/* Performance Insights */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h3 className='text-lg font-semibold mb-4 text-gray-800'>
                Performance Insights
              </h3>
              <ul className='space-y-3'>
                <li className='flex justify-between border-b pb-2'>
                  <span className='text-gray-600'>Highest Score</span>
                  <span className='font-bold text-green-600'>
                    {performanceStats.highestScore}
                  </span>
                </li>
                <li className='flex justify-between border-b pb-2'>
                  <span className='text-gray-600'>Lowest Score</span>
                  <span className='font-bold text-red-600'>
                    {performanceStats.lowestScore}
                  </span>
                </li>
                <li className='flex justify-between border-b pb-2'>
                  <span className='text-gray-600'>Median Score</span>
                  <span className='font-bold'>
                    {performanceStats.medianScore}
                  </span>
                </li>
                <li className='flex justify-between'>
                  <span className='text-gray-600'>Score Range</span>
                  <span className='font-bold'>
                    {performanceStats.scoreRange}
                  </span>
                </li>
              </ul>
            </div>

            {/* Recent Updates */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h3 className='text-lg font-semibold mb-4 text-gray-800'>
                Recent Updates
              </h3>
              <div className='space-y-3'>
                {recentUpdates.map((update, index) => (
                  <div key={index} className='bg-gray-50 p-3 rounded-lg'>
                    <p className='text-sm text-gray-700'>
                      <strong>{update.player}</strong> {update.details}
                    </p>
                    <span className='text-xs text-gray-500'>{update.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;