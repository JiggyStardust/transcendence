import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/Button.tsx";

export default function Testing() {
  return (
	<div className="w-screen min-h-screen">
	  <ThemeToggle />
		<div className="mt-[400px]">
		<Button variant="primary" size="sm">Primary</Button>
		<Button variant="primary" size="md">Primary</Button>
		<Button variant="primary" size="lg">Primary</Button>
		<Button variant="secondary" size="sm">Secondary</Button>
		<Button variant="secondary" size="md">Secondary</Button>
		<Button variant="secondary" size="lg">Secondary</Button>

		<Button variant="primary" size="sm" disabled={true} >Primary</Button>
		<Button variant="primary" size="md" disabled={true}>Primary</Button>
		<Button variant="primary" size="lg" disabled={true}>Primary</Button>
		<Button variant="secondary" size="sm" disabled={true}>Secondary</Button>
		<Button variant="secondary" size="md" disabled={true}>Secondary</Button>
		<Button variant="secondary" size="lg" disabled={true}>Secondary</Button>
		</div>
	</div>
  );
}