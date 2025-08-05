import { ContactDetails } from "./_components/contact-details"
import { FeedbackForm } from "./_components/feedback-form"


export default async function ContactsPage() {
	return (
		<main className="max-w-4xl mx-auto py-20 px-4 text-white space-y-10">
			<div className="grid grid-cols-1 md:grid-cols-2 bg-black">
				<ContactDetails />
				<FeedbackForm />
			</div>
		</main>
	)
}