import exp from 'constants';
import { User } from '../../model/user';

test('given: valid values for user, when: user is created, then: user is created with those values', () => {
    //when
    const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ucll.be',
        password: 'john123',
        role: 'USER',
    });

    //then
    expect(user.getFirstName()).toEqual('John');
    expect(user.getLastName()).toEqual('Doe');
    expect(user.getEmail()).toEqual('john.doe@ucll.be');
    expect(user.getPassword()).toEqual('john123');
    expect(user.getRole()).toEqual('USER');
});

test('given: invalid first name for user, when: user is created, then: error is thrown', () => {
    //when
    const user = () => {
        new User({
            firstName: '',
            lastName: 'Doe',
            email: 'john.doe@ucll.be',
            password: 'john123',
            role: 'USER',
        });
    };

    //then
    expect(user).toThrow('First name is required');
});
