import { Component, type ReactNode } from 'react';
import { EngineeringPoster } from './EngineeringPoster';

type Props = { children: ReactNode; onFailure: () => void };
type State = { failed: boolean };

/** WebGL model parsing or device failure must not take the entire site down. */
export class EngineeringCanvasBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) {
      console.error('[engineering] scene failed:', error);
    }
    this.props.onFailure();
  }

  render() {
    if (this.state.failed) return <EngineeringPoster unavailable />;
    return this.props.children;
  }
}
