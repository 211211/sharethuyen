module ApplicationHelper
  def rubix_dir
    return Rails.application.config.rubix[:direction]
  end

  def rubix_assets
    dir = 'main'
    if Rails.application.config.rubix[:direction] == 'rtl'
      dir = 'main-rtl'
    end

    if Rails.env.development?
      return [
        content_tag('script', nil, src: 'http://localhost:8079/assets/js/devServerClient.js').html_safe,
        content_tag('script', nil, src: 'http://localhost:8079/assets/js/'+dir+'.js').html_safe,
        content_tag('script', nil, src: 'http://localhost:8079/assets/js/plugins.js').html_safe,
        content_tag('script', nil, src: 'http://localhost:8079/assets/js/app.js').html_safe
      ].join("\n").html_safe
    end

    app_version = ENV["APP_VERSION"].presence || "1.0.0"

    return [
      content_tag('link', nil, rel: 'stylesheet', href: "/css/#{dir}.css?v=#{app_version}"),
      content_tag('script', nil, src: "/js/plugins.js?v=#{app_version}"),
      content_tag('script', nil, src: "/js/app.js?v=#{app_version}")
    ].join("\n").html_safe
  end

  def boat_status_tag(status)
    status = 'In Use' if status == 'Water'
    content_tag(:span, status, class: "label boat-status-label #{status.parameterize}"  )
  end

  def email_image_header
    Setting.email_image.present? ? image_tag(Setting.email_image, style: "max-width: 100%; height: auto") : nil
  end

  def website_url
    Setting.website_url.present? ? Setting.website_url : "http://seattleboatshare.com/"
  end
end
