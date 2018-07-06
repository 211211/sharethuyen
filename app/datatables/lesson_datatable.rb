class LessonDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: Lesson.count,
      recordsFiltered: lessons.total_entries,
      data: data
    }
  end

private

  def data
    lessons.map do |lesson|
      [
        lesson.id,
        lesson.name,
        lesson.price
      ]
    end
  end

  def lessons
    @lessons ||= fetch_lessons
  end

  def fetch_lessons

    if params[:search].present?
      q = params[:search][:value]
      lessons = Lesson.ransack(name_cont: q)
    else
      lessons = Lesson.ransack()
    end

    lessons.sorts = "#{sort_column} #{sort_direction}"
    lessons.result.page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id name price]
    if ((params["order"].present?) &&
        (params["order"]["0"].present?) &&
        (params["order"]["0"]["column"].present?))
      columns[params[:order]['0'][:column].to_i]
    else
      "id"
    end
  end

  def sort_direction
    if ((params["order"].present?) &&
        (params["order"]["0"].present?) &&
        (params["order"]["0"]["dir"].present?))
      params[:order]['0'][:dir] == "desc" ? "desc" : "asc"
    else
      "desc"
    end
  end
end
