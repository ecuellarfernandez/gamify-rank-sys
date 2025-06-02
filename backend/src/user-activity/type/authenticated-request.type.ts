export default interface AuthenticatedRequest extends Request {
    user: { id: string };
}
