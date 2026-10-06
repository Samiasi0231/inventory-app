interface ResendCodeProps {
  /** Seconds left before the user can request another code. */
  seconds: number;
  onResend: () => void;
}
 
export function ResendCode({ seconds, onResend }: ResendCodeProps) {
  return (
    <p className="text-[10px] text-neutral-500">
      {seconds > 0 ? (
        <>Code Resent. Try again in {seconds}secs</>
      ) : (
        <>
          Didn't Receive A Code?{" "}
          <button type="button" onClick={onResend} className="font-semibold text-red-600 hover:underline">
            Resend
          </button>
        </>
      )}
    </p>
  );
}