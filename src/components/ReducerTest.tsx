import { useReducer } from 'react';

type ReducerState = {
  currentState: string;
  profile: string;
  counter: number;
};

type ReducerAction = 
  | { type: 'SET_STATE'; payload: string }
  | { type: 'SET_PROFILE'; payload: string }
  | { type: 'INCREMENT' };

function stateReducer(state: ReducerState, action: ReducerAction): ReducerState {
  console.log("🔄 REDUCER executado:", action.type, action.payload);
  
  switch (action.type) {
    case 'SET_STATE':
      console.log("📝 Reducer mudando estado para:", action.payload);
      return { ...state, currentState: action.payload, counter: state.counter + 1 };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    default:
      return state;
  }
}

interface ReducerTestProps {
  onStateChange: (state: string) => void;
}

export function ReducerTest({ onStateChange }: ReducerTestProps) {
  const [state, dispatch] = useReducer(stateReducer, {
    currentState: 'start',
    profile: '',
    counter: 0
  });

  const testReducerNavigation = () => {
    console.log("🧪 Testando navegação com useReducer");
    dispatch({ type: 'SET_STATE', payload: 'candidate-registration' });
    onStateChange('candidate-registration');
  };

  const forceIncrement = () => {
    dispatch({ type: 'INCREMENT' });
  };

  return (
    <div className="fixed top-40 left-4 bg-green-800 text-white p-4 rounded-lg z-50 space-y-2">
      <div className="font-bold text-sm">🧪 REDUCER TEST</div>
      
      <div className="space-y-1 text-xs">
        <div>Estado: <span className="font-mono">{state.currentState}</span></div>
        <div>Profile: <span className="font-mono">{state.profile}</span></div>
        <div>Counter: <span className="font-mono">{state.counter}</span></div>
      </div>

      <div className="space-y-1">
        <button
          onClick={testReducerNavigation}
          className="block w-full bg-green-600 px-2 py-1 rounded text-xs"
        >
          TESTAR REDUCER
        </button>
        
        <button
          onClick={forceIncrement}
          className="block w-full bg-blue-600 px-2 py-1 rounded text-xs"
        >
          + Counter
        </button>
        
        <button
          onClick={() => dispatch({ type: 'SET_PROFILE', payload: 'candidate' })}
          className="block w-full bg-purple-600 px-2 py-1 rounded text-xs"
        >
          Set Profile
        </button>
      </div>

      <div className="text-xs border-t border-green-600 pt-2">
        <div>Reducer funcionando: {state.counter > 0 ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}