type Props = {
	error?: string
	t: (key: string, ...args: never[]) => string
}
export const FormErrorMessage = ({ error, t }: Props) => {
	if (!error) return null;
	return <p className="text-sm font-medium text-destructive">{t(error as keyof typeof t)}</p>
}
