import { Button } from './components/ui/button';
import { LogIn } from 'lucide-react';

function App() {
	return (
		<>
			<h1 className="text-9xl">Hello World</h1>
			<Button>
				<LogIn />
				Join Now
			</Button>
		</>
	);
}

export default App;
