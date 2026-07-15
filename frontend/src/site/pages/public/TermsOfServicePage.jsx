export default function TermsOfServicePage() {
    return (
        <div className="w-full bg-[#fcfbf7] text-stone-800 min-h-screen font-[var(--font-inter)] py-12 lg:py-20 selection:bg-orange-200 selection:text-orange-900">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-bold tracking-tight text-stone-800 mb-6">
                    Terms of Service
                </h1>

                <p className="font-semibold text-[#ea580c] tracking-widest text-sm uppercase mb-12">
                    CivikEye - Last updated: July 4, 2026
                </p>

                <div className="text-[17px] text-stone-500 space-y-8 leading-[1.7]">
                    <p>
                        CivikEye is a <strong>demo project</strong> created for
                        demonstration purposes only. It is{" "}
                        <strong>not connected to any government</strong> and
                        does not provide any real civic or public service. By
                        using CivikEye, you agree to these terms. If you don't
                        agree, please don't use the app.
                    </p>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Using CivikEye
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            You must give accurate information when signing up.
                        </li>
                        <li>
                            You are responsible for keeping your password safe
                            and for everything done through your account.
                        </li>
                        <li>You need to verify your email.</li>
                    </ul>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Your responsibilities
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>Use the app only for testing and demonstration.</li>
                        <li>
                            Please avoid submitting sensitive information, since
                            this is a demo.
                        </li>
                        <li>
                            Do not post false, offensive, or illegal content.
                        </li>
                        <li>Do not spam or do fake upvotes.</li>
                        <li>
                            Do not try to break into or disrupt the app or other
                            accounts.
                        </li>
                    </ul>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Your complaints
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            You own the content you submit, but by posting it
                            you allow the app to use and display it within the
                            demo.
                        </li>
                        <li>
                            Your complaints visible to other users inside the
                            demo. However, you can hide your personal
                            information.
                        </li>
                    </ul>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        No real service or resolution
                    </h2>
                    <p>
                        Because this is a demo, complaints are{" "}
                        <strong>not</strong> sent to any government department,
                        and <strong>no</strong> issue reported here will be
                        acted on or resolved. Anything shown in the app
                        (statuses, timelines, departments) is only for
                        demonstration.
                    </p>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        App rights
                    </h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            Accounts that break these rules or submit fake
                            reports may be suspended or removed.
                        </li>
                        <li>
                            The app is provided "as is" for demo use only, with
                            no warranties of any kind.
                        </li>
                    </ul>

                    <h2 className="font-[var(--font-satoshi)] text-2xl font-bold tracking-tight text-stone-800 mt-16 mb-6">
                        Changes
                    </h2>
                    <p>
                        These terms may be updated from time to time. The new
                        version will be posted with the date updated at the top.
                    </p>
                </div>
            </div>
        </div>
    );
}
