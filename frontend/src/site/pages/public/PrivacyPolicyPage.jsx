export default function PrivacyPolicyPage() {
    return (
        <div className="w-full bg-[#fcfbf7] text-stone-800 min-h-screen font-[var(--font-inter)] py-12 lg:py-20 selection:bg-orange-200 selection:text-orange-900">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-bold tracking-tight text-stone-800 mb-6">
                    Privacy Policy
                </h1>

                <p className="font-semibold text-[#ea580c] tracking-widest text-sm uppercase mb-12">
                    CivikEye - Last updated: July 4, 2026
                </p>

                <div className="text-[17px] text-stone-500 space-y-8 leading-[1.7]">
                    <p>
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

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        What the system collects
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
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

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        How the information is used
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
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

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Who the information is shared with
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            Other users - since complaints (photos, location,
                            and details) may be visible inside the demo app to
                            show how transparency would work.
                        </li>
                    </ul>
                    <p>
                        Because this is a demo, complaints are{" "}
                        <strong>not</strong> forwarded to any government
                        departments or officials. Your personal information is{" "}
                        <strong>not</strong> sold.
                    </p>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Your choices
                    </h2>
                    <p>
                        You can view, edit, or delete your account and data at
                        any time. Location access can also be turned off
                        whenever you want.
                    </p>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Security
                    </h2>
                    <p>
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
