module Api
  class UrlsController < ApiController
    # route only available for development and testing
    def index 
      user_id = params[:user_id]

      # return url associated with logged in user only 
      if !!user_id == true
        render json: {success:true , data: {url: Url.where(user_id: user_id).as_json(methods: [:visit_count])}}
      elsif !!user_id == false
        render json: {success:true , data: {url: Url.all}}
      else 
        render json: { success: false }, status: :not_found
      end
    end  

    def new; end

    def create
      # return existing shortened url if already existing
      url = Url.find_by(url: params[:url])
      # create vanity url if logged in
      user_id = params[:user_id]  
      
      if !url and !!user_id == true
        slug = Url.generate_slug
        url = Url.create(url: params[:url], slug: slug, user_id: user_id)
      elsif !url and !!user_id == false 
        slug = Url.generate_slug
        url = Url.create(url: params[:url], slug: slug, user_id: nil)
      end

      if url.valid?
        render json: { success: true, data: { url: url } }
      else
        Rails.logger.error url.errors.messages
        render json: { success: false, errors: url.errors.messages }, status: :unprocessable_entity
      end
    end

    def show
      url = Url.find_by(slug: params[:id])

      # for infinite scroll
      stats_count = params[:stats_count].to_i
      limit = params[:limit].to_i
      
      if url and (stats_count != 0 or limit != 0) 
        render json: { success: true, data: { url: url.as_json(methods: [:statistics, :visit_count], :stats_count => stats_count , :limit => limit)
        }} 
      elsif url
        render json: { success: true, data: { url: url.as_json(methods: [:statistics]) } }
      else 
        render json: { success: false }, status: :not_found
      end
    end

    def update
      url = Url.find_by(id: params[:id])
      custom_slug = params[:custom_slug]
      slug = Url.generate_slug(custom_slug)

      if !custom_slug # if patch called but no custom slug passed, delete association
        update = url.update(user_id: nil)
      else
        update = url.update(slug: slug)
      end
      
      if update
        render json: { success: true, data: { url: url.as_json(methods: [:statistics]) } }
      else 
        render json: { success: false }, status: :failed_dependency
      end
    end
  end
end