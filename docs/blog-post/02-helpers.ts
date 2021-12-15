type Success<T> = { status: 'SUCCESS'; value: T };
type Failure<T> = { status: 'FAILURE'; value: T };
type Either<S, F> = Success<S> | Failure<F>;

const success = <T>(v: T): Success<T> => {
    return {
        status: 'SUCCESS',
        value: v,
    };
};

const failure = <T>(v: T): Failure<T> => {
    return {
        status: 'FAILURE',
        value: v,
    };
};

const isSuccess = <S, F>(either: Either<S, F>): either is Success<S> =>
    either.status === 'SUCCESS';

const isFailure = <S, F>(either: Either<S, F>): either is Failure<F> =>
    either.status === 'FAILURE';
