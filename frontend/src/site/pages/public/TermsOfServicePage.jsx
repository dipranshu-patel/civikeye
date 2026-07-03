export default function TermsOfServicePage() {
    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-gray-900 py-16 px-6 lg:px-8 selection:bg-gray-200">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
                    Terms of Service
                </h1>
                
                <div className="text-base text-gray-600 space-y-6">
                    <p className="font-semibold text-gray-900 leading-relaxed">
                        CivikEye - Last updated: July 4, 2026
                    </p>
                    
                    <p className="leading-relaxed">
                        CivikEye is a <strong>demo project</strong> created for demonstration purposes only. It is <strong>not connected to any government</strong> and does not provide any real civic or public service. By using CivikEye, you agree to these terms. If you don't agree, please don't use the app.
                    </p>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Using CivikEye
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>You must give accurate information when signing up.</li>
                        <li>You are responsible for keeping your password safe and for everything done through your account.</li>
                        <li>You need to verify your email.</li>
                    </ul>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Your responsibilities
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>Use the app only for testing and demonstration.</li>
                        <li>Please avoid submitting sensitive information, since this is a demo.</li>
                        <li>Do not post false, offensive, or illegal content.</li>
                        <li>Do not spam or do fake upvotes.</li>
                        <li>Do not try to break into or disrupt the app or other accounts.</li>
                    </ul>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Your complaints
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>You own the content you submit, but by posting it you allow the app to use and display it within the demo.</li>
                        <li>Your complaints visible to other users inside the demo. However, you can hide your personal information.</li>
                    </ul>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        No real service or resolution
                    </h2>
                    <p className="leading-relaxed">
                        Because this is a demo, complaints are <strong>not</strong> sent to any government department, and <strong>no</strong> issue reported here will be acted on or resolved. Anything shown in the app (statuses, timelines, departments) is only for demonstration.
                    </p>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        App rights
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>Accounts that break these rules or submit fake reports may be suspended or removed.</li>
                        <li>The app is provided "as is" for demo use only, with no warranties of any kind.</li>
                    </ul>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Changes
                    </h2>
                    <p className="leading-relaxed">
                        These terms may be updated from time to time. The new version will be posted with the date updated at the top.
                    </p>
                </div>
            </div>
        </div>
    );
}
