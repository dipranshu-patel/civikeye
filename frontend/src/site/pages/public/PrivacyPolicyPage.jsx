export default function PrivacyPolicyPage() {
    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-gray-900 py-16 px-6 lg:px-8 selection:bg-gray-200">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
                    Privacy Policy
                </h1>

                <div className="text-base text-gray-600 space-y-6">
                    <p className="font-semibold text-gray-900 leading-relaxed">
                        CivikEye - Last updated: July 4, 2026
                    </p>

                    <p className="leading-relaxed">
                        CivikEye is a <strong>demo project</strong> that shows
                        how citizens could report local civic problems like
                        potholes, garbage, broken streetlights, and water
                        issues. It is{" "}
                        <strong>
                            not affiliated with, endorsed by, or connected to
                            any government body or department
                        </strong>
                        , and complaints submitted here are <strong>not</strong>{" "}
                        sent to any real authority. This policy explains what
                        information the system collects and how it is used.
                    </p>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        What the system collects
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>Your name, email and password when you sign up.</li>
                        <li>
                            The complaints you file - descriptions, photos, and
                            the category of the issue.
                        </li>
                        <li>
                            The location of the problem you report (with your
                            permission).
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        How the information is used
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>To create and manage your account.</li>
                        <li>
                            To register and track complaints within this demo
                            app only.
                        </li>
                        <li>
                            To notify you when the status of your complaint
                            changes.
                        </li>
                        <li>
                            To show complaints, locations, and upvotes to other
                            demo users.
                        </li>
                        <li>
                            To verify reports and prevent spam or fake
                            complaints.
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Who the information is shared with
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>
                            Other users - since complaints (photos, location,
                            and details) may be visible inside the demo app to
                            show how transparency would work.
                        </li>
                    </ul>
                    <p className="leading-relaxed">
                        Because this is a demo, complaints are{" "}
                        <strong>not</strong> forwarded to any government
                        departments or officials. Your personal information is{" "}
                        <strong>not</strong> sold.
                    </p>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Your choices
                    </h2>
                    <p className="leading-relaxed">
                        You can view, edit, or delete your account and data at
                        any time. Location access can also be turned off
                        whenever you want.
                    </p>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-10 mb-4">
                        Security
                    </h2>
                    <p className="leading-relaxed">
                        Reasonable measures like encryption and secure logins
                        are used to protect your data. However, this is a demo
                        project and no system is completely safe, so please
                        don't submit any sensitive information.
                    </p>
                </div>
            </div>
        </div>
    );
}
