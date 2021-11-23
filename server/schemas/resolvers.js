const { AuthenticationError } = require('apollo-server-express')
const {Book, User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async(parent, args,context) => {
console.log(context.user)
            return User.findById(context.user._id)
        }
    },

    Mutation: {
        addUser: async(parent, {username, email, password}) => {
            const user = await User.create({username, email, password})
            const token = signToken(user)

            return { token, user }
        },

        login: async(parent, { body }) => {
            console.log(body)
            const user = await User.findOne({ email: body.email })

            if(!user) {
                throw new AuthenticationError('No profile with this email has been found')
            }

            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw) {
                throw new AuthenticationError('Incorrect username or password')
            }

            const token = signToken(user)
            return { token, user }
        },

        saveBook: async(parent, { user, body }, context) => {
            if(context.user) {
                return User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                )
            }

            throw new AuthenticationError('You must be logged in to save a book!')
        },

        removeBook: async(parent, { user, params }, context) => {
            if(context.user) {
                return User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                )
            }

            throw new AuthenticationError('You must be logged in to remove a book!')
        }

    }
}

module.exports = resolvers