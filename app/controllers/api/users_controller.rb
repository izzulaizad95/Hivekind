module Api
  class UsersController < AuthorizedApiController
    skip_before_action :authorized?, only: :whoami

    def whoami
      if current_user
        render json: { success: true, data: { current_user: current_user.as_json(methods: [:urls] )}}
        
      else
        render json: { success: false }, status: :unauthorized
      end
    end
  end
end


# (include: :urls, methods: [:analytics_link, :shortened_link]) } } # experimenting ways to grab custom urls